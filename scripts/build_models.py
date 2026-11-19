"""Turn the fitted SINDy models of the LFP project into the data behind the
Home-page drawing.

Reads only the sweep tables of fitted coefficients (no recordings). Every
model is run forward from the same synthetic starting state, sorted into one
of the three types named in the project README, and written out as a short
trajectory in its first two delay coordinates.

Run with the LFP project's Python (needs numpy and scipy):

  <lfp-symreg>/.venv/bin/python scripts/build_models.py <lfp-symreg>

Writes public/models/trajectories.bin and public/models/meta.json.
"""

import csv
import hashlib
import json
import re
import sys
import time
from pathlib import Path

import numpy as np
from scipy.integrate import solve_ivp

csv.field_size_limit(10**9)

POINTS = 48          # samples kept per trajectory
PERIODS = 2.5        # length of the kept trajectory, in periods of the rhythm
HORIZON_S = 2.0      # how long each model is run to decide its type
BLOWUP = 10.0        # "diverged": any coordinate beyond this many starting amplitudes
MAX_RHS = 150_000    # give up on a model after this many equation evaluations
CLIP = 4.0           # trajectories are stored within +-CLIP starting amplitudes

OSCILLATOR, WEAKLY_NONLINEAR, UNSTABLE = 0, 1, 2


def sweeps(root: Path):
  """Yield (sweep name, units, rows) for every sweep with stored coefficients."""
  base = root / "outputs" / "pysindy"
  for parts in sorted(base.glob("**/parts")):
    sweep = parts.parent
    metas = sorted(parts.glob("*_metadata.json"))
    if not metas:
      continue
    normalization = json.loads(metas[0].read_text())["preprocessing"]["normalization"]
    merged = sweep / "raw_grid_merged.csv"
    files = [merged] if merged.exists() else sorted(parts.glob("part_*.csv"))
    rows = []
    for f in files:
      with open(f, newline="") as fh:
        rows += [r for r in csv.DictReader(fh) if r.get("fit_status") == "success"]
    yield str(sweep.relative_to(base)), normalization, rows


def compile_model(names, coefficients):
  """Return rhs(x) evaluating only the terms with a nonzero coefficient."""
  coefficients = np.asarray(coefficients, dtype=float)
  n = coefficients.shape[0]
  used = np.flatnonzero(np.any(coefficients != 0, axis=0))
  poly, poly_cols, trig, trig_cols = [], [], [], []
  for col in used:
    name = names[col]
    m = re.fullmatch(r"(sin|cos)\((\d+) x(\d+)\)", name)
    if m:
      trig.append((m.group(1) == "sin", int(m.group(2)), int(m.group(3))))
      trig_cols.append(col)
      continue
    powers = np.zeros(n)
    if name != "1":
      for factor in name.split(" "):
        var, _, power = factor.partition("^")
        powers[int(var[1:])] += int(power or 1)
    poly.append(powers)
    poly_cols.append(col)
  exponents = np.array(poly).reshape(len(poly), n)
  c_poly = coefficients[:, poly_cols]
  c_trig = coefficients[:, trig_cols]
  is_sin = np.array([t[0] for t in trig], dtype=bool)
  freq = np.array([t[1] for t in trig], dtype=float)
  var = np.array([t[2] for t in trig], dtype=int)

  def rhs(x):
    out = c_poly @ np.prod(x ** exponents, axis=1) if len(poly) else np.zeros(n)
    if len(trig):
      angle = freq * x[var]
      out = out + c_trig @ np.where(is_sin, np.sin(angle), np.cos(angle))
    return out

  return rhs


class TooSlow(Exception):
  pass


def run(rhs, x_start, amplitude, t_keep):
  """Run one model. Returns (diverged, kept trajectory or None)."""
  calls = 0

  def f(_t, x):
    nonlocal calls
    calls += 1
    if calls > MAX_RHS:
      raise TooSlow
    return rhs(x)

  def blowup(_t, x):
    return BLOWUP * amplitude - np.max(np.abs(x))
  blowup.terminal = True

  try:
    with np.errstate(all="ignore"):
      sol = solve_ivp(f, (0, HORIZON_S), x_start, method="LSODA", t_eval=t_keep,
                      events=blowup, rtol=1e-5, atol=1e-7 * amplitude)
  except (TooSlow, FloatingPointError, ValueError):
    return True, None
  diverged = sol.status != 0 or not np.all(np.isfinite(sol.y))
  return diverged, sol.y


def main():
  root = Path(sys.argv[1]).expanduser()
  site = Path(__file__).resolve().parent.parent
  models, seen = [], set()
  for sweep, normalization, rows in sweeps(root):
    for r in rows:
      key = hashlib.sha1((normalization + r["lowpass_hz"] + r["n_delays"] + r["delay_samples"]
                          + r["smooth_window_samples"] + r["coefficients_json"]).encode()).hexdigest()
      if key in seen:
        continue
      seen.add(key)
      models.append((sweep, normalization, r))
  print(f"{len(models)} distinct fitted models", flush=True)

  # The shared rhythm: the median frequency of the linear two-coordinate models.
  freqs = []
  for _, _, r in models:
    if r.get("degree") == "1" and r["n_delays"] == "2":
      c = np.array(json.loads(r["coefficients_json"]))[:, 1:]
      f = np.abs(np.linalg.eigvals(c).imag).max() / (2 * np.pi)
      if f > 0:
        freqs.append(f)
  f0 = float(np.median(freqs))
  print(f"shared rhythm {f0:.1f} Hz from {len(freqs)} linear models", flush=True)

  t_keep = np.linspace(0, PERIODS / f0, POINTS)
  trajectories = np.zeros((len(models), POINTS, 2), dtype=np.int8)
  meta, counts, slow = [], [0, 0, 0], 0
  started = time.time()
  for i, (sweep, normalization, r) in enumerate(models):
    n, delay_s = int(r["n_delays"]), float(r["delay_ms"]) / 1000
    scale = 1.0 if normalization == "global_zscore" else float(r.get("training_lfp_rms_uv") or 36.856)
    amplitude = np.sqrt(2) * scale
    x_start = amplitude * np.sin(np.pi / 3 - 2 * np.pi * f0 * delay_s * np.arange(n))
    rhs = compile_model(json.loads(r["feature_names_json"]), json.loads(r["coefficients_json"]))
    diverged, y = run(rhs, x_start, amplitude, t_keep)
    if y is None:
      slow += 1
      y = np.empty((n, 0))
    linear = r.get("degree") == "1"
    kind = UNSTABLE if diverged else OSCILLATOR if linear else WEAKLY_NONLINEAR
    counts[kind] += 1
    kept = np.clip(y[:2].T / amplitude, -CLIP, CLIP)
    if len(kept) < POINTS:  # stopped early: hold the last point reached
      last = kept[-1] if len(kept) else x_start[:2] / amplitude
      kept = np.vstack([kept, np.tile(last, (POINTS - len(kept), 1))])
    trajectories[i] = np.round(kept / CLIP * 127)
    meta.append([kind, int(r.get("degree") or 0), n, float(r["lowpass_hz"]), float(r["delay_ms"])])
    if (i + 1) % 200 == 0:
      print(f"  {i + 1}/{len(models)}  {time.time() - started:.0f}s  {counts}", flush=True)

  out = site / "public" / "models"
  out.mkdir(parents=True, exist_ok=True)
  (out / "trajectories.bin").write_bytes(trajectories.tobytes())
  (out / "meta.json").write_text(json.dumps({
    "points": POINTS, "clip": CLIP, "rhythm_hz": round(f0, 2), "counts": counts,
    "columns": ["type", "degree (0 = Fourier library)", "delay coordinates", "low-pass Hz", "delay ms"],
    "models": meta,
  }, separators=(",", ":")))
  print(f"oscillators {counts[0]}, weakly nonlinear {counts[1]}, unstable {counts[2]} "
        f"(of which {slow} abandoned as too slow)")


if __name__ == "__main__":
  main()
