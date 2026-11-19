"""Turn FreeSurfer's average brain into the points behind the Home-page atlas.

Reads only the `fsaverage` template that ships with FreeSurfer (the pial and
inflated surfaces and the Desikan-Killiany `aparc` labels of both hemispheres). No
subject data is read.

Each point is a place on the cortical surface, picked so that equal areas of
cortex get equal numbers of points, with the direction the surface faces there
and the colour FreeSurfer gives its region. Points on the medial wall, which
has no region, are left out. The points are stored in shuffled order, so any
first N of them is an even sample.

Run with FreeSurfer's Python (it has nibabel and numpy):

  $FREESURFER_HOME/python/bin/python3 scripts/build_atlas.py $FREESURFER_HOME

Writes public/atlas/points.bin and public/atlas/meta.json.

points.bin, for N points: N*3 int16 positions (x right, y front, z up, in
units of meta.unit_mm, centred on the brain), then N*3 int8 facing directions
(a unit vector times 127), then N*3 uint8 colours (red, green, blue), then the
same points on the inflated surface: N*3 int16 positions and N*3 int8 facing
directions. The two inflated hemispheres are set side by side, GAP_MM apart.
"""

import json
import sys
from pathlib import Path

import nibabel.freesurfer as fs
import numpy as np

POINTS = 16000
UNIT_MM = 0.01
SEED = 7
GAP_MM = 12


def facing(verts, faces):
  """Per-vertex unit normals of a surface."""
  a, b, c = (verts[faces[:, i]] for i in range(3))
  cross = np.cross(b - a, c - a)
  normals = np.zeros_like(verts)
  for i in range(3):
    np.add.at(normals, faces[:, i], cross)
  return normals / np.linalg.norm(normals, axis=1, keepdims=True)


def hemisphere(subject: Path, hemi: str):
  """Vertices, normals, areas and colours of one hemisphere, and the same
  vertices and normals on its inflated surface."""
  verts, faces = fs.read_geometry(subject / "surf" / f"{hemi}.pial")
  labels, table, _ = fs.read_annot(subject / "label" / f"{hemi}.aparc.annot")
  inflated, _ = fs.read_geometry(subject / "surf" / f"{hemi}.inflated")
  # Each inflated hemisphere is centred on its own origin: move them apart.
  if hemi == "lh":
    inflated[:, 0] -= inflated[:, 0].max() + GAP_MM / 2
  else:
    inflated[:, 0] -= inflated[:, 0].min() - GAP_MM / 2
  a, b, c = (verts[faces[:, i]] for i in range(3))
  cross = np.cross(b - a, c - a)                       # length = twice the face area
  normals = np.zeros_like(verts)
  area = np.zeros(len(verts))
  for i in range(3):
    np.add.at(normals, faces[:, i], cross)
    np.add.at(area, faces[:, i], np.linalg.norm(cross, axis=1) / 6)
  normals /= np.linalg.norm(normals, axis=1, keepdims=True)
  # Label 0 is "unknown" (the medial wall), -1 is unlabelled.
  area[labels <= 0] = 0
  colours = table[np.clip(labels, 0, None), :3]
  return verts, normals, area, colours, inflated, facing(inflated, faces)


def main():
  home = Path(sys.argv[1])
  subject = home / "subjects" / "fsaverage"
  parts = [hemisphere(subject, h) for h in ("lh", "rh")]
  verts, normals, area, colours, inflated, inflated_normals = (np.concatenate([p[i] for p in parts]) for i in range(6))

  rng = np.random.default_rng(SEED)
  pick = rng.choice(len(verts), size=POINTS, replace=False, p=area / area.sum())
  rng.shuffle(pick)

  centre = (verts.min(axis=0) + verts.max(axis=0)) / 2
  position = np.round((verts[pick] - centre) / UNIT_MM).astype("<i2")
  toward = np.round(normals[pick] * 127).astype(np.int8)
  centre2 = (inflated.min(axis=0) + inflated.max(axis=0)) / 2
  position2 = np.round((inflated[pick] - centre2) / UNIT_MM).astype("<i2")
  toward2 = np.round(inflated_normals[pick] * 127).astype(np.int8)
  colour = colours[pick].astype(np.uint8)

  out = Path(__file__).resolve().parent.parent / "public" / "atlas"
  out.mkdir(parents=True, exist_ok=True)
  (out / "points.bin").write_bytes(position.tobytes() + toward.tobytes() + colour.tobytes()
                                    + position2.tobytes() + toward2.tobytes())
  half = ((verts.max(axis=0) - verts.min(axis=0)) / 2).round(1).tolist()
  (out / "meta.json").write_text(json.dumps({
    "points": POINTS, "unit_mm": UNIT_MM, "half_extent_mm": half,
    "inflated_half_extent_mm": ((inflated.max(axis=0) - inflated.min(axis=0)) / 2).round(1).tolist(),
    "source": "FreeSurfer fsaverage, pial and inflated surfaces, Desikan-Killiany atlas (aparc)",
  }))
  print(f"{POINTS} points, half extent {half} mm, {len(set(map(tuple, colour.tolist())))} regions")


if __name__ == "__main__":
  main()
