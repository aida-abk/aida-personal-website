# abkenova.com

Source for Aida Abkenova's personal site. A static Next.js export, published to GitHub Pages.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit the content

All text lives in `content/`, one file per page:

| File | Page |
|---|---|
| `home.ts` | Home |
| `trajectory.ts` | Trajectory |
| `projects.ts` | Projects |
| `reading.ts` | Reading |
| `whyBci.ts` | Why BCI |
| `stream.ts` | Stream of Thoughts |
| `references.ts` | The phrases that become links |

The CV, figures and data files are in `public/`.

## Publish

Every push to `main` builds the site and deploys it, through `.github/workflows/deploy.yml`. To check the build first, run `npm run build`; the result is written to `out/`.

## Credits

The brain on the home page is drawn from FreeSurfer's `fsaverage` template with the Desikan-Killiany atlas. Its trace is the simulated output of a fitted model, not a recording.
