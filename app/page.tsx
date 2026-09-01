'use client';

import { FormEvent, useEffect, useState } from 'react';

type GalleryItem = {
  src: string;
  shape: string;
  type?: 'video';
  poster?: string;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

function mediaUrl(src: string) {
  return `${basePath}${src}`;
}

const media: GalleryItem[] = [
  { src: '/media/photo-04.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-13.jpg', shape: 'photo--wide' },
  { src: '/media/photo-07.jpg', shape: 'photo--landscape' },
  { src: '/media/photo-14.jpg', shape: 'photo--landscape' },
  { src: '/media/photo-09.jpg', shape: 'photo--landscape' },
  { src: '/media/video-03.m4v', shape: 'photo--portrait', type: 'video', poster: '/media/video-03-poster.jpg' },
  { src: '/media/photo-11.jpg', shape: 'photo--tall' },
  { src: '/media/photo-12.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-15.jpg', shape: 'photo--tall' },
  { src: '/media/photo-16.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-17.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-18.jpg', shape: 'photo--tall' },
  { src: '/media/photo-19.jpg', shape: 'photo--tall' },
  { src: '/media/video-02.m4v', shape: 'photo--landscape', type: 'video', poster: '/media/video-02-poster.jpg' },
  { src: '/media/photo-22.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-20.jpg', shape: 'photo--wide' },
  { src: '/media/photo-24.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-25.jpg', shape: 'photo--portrait' },
  { src: '/media/photo-26.jpg', shape: 'photo--landscape' },
  { src: '/media/photo-28.jpg', shape: 'photo--landscape' },
  { src: '/media/video-04.m4v', shape: 'photo--landscape', type: 'video', poster: '/media/video-04-poster.jpg' },
  { src: '/media/photo-29.jpg', shape: 'photo--portrait' },
];

const previousMiniCaption = 'Mamos miniukas, mašiniukas su kuriuo mane išmokei vairuoti. Nuotrauka daryta, tik parsivarius į Šiaulius.';
const correctedMiniCaption = 'Mamos miniukas – mašiniukas, su kuriuo mane išmokei vairuoti. Nuotrauka daryta tik parsivežus jį į Šiaulius.';

const previousMediaSources = [
  ...media.slice(0, 13).map((item) => item.src),
  '/media/photo-21.jpg',
  ...media.slice(13).map((item) => item.src),
];

function correctCaption(caption: unknown) {
  return caption === previousMiniCaption ? correctedMiniCaption : String(caption ?? '');
}

export default function Home() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [captions] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};

    try {
      const savedCaptions = JSON.parse(
        window.localStorage.getItem('mamos-gimtadienis-captions') ?? '{}',
      ) as Record<string, unknown>;
      const entries = Object.entries(savedCaptions);
      const migratedCaptions = Object.fromEntries(
        entries.flatMap(([key, caption]) => {
          if (key.startsWith('/media/')) return [];

          const index = Number(key);
          const src = Number.isInteger(index)
            ? previousMediaSources[index] ?? media[index]?.src
            : undefined;

          return src ? [[src, correctCaption(caption)]] : [];
        }),
      );
      const directCaptions = Object.fromEntries(
        entries.flatMap(([src, caption]) =>
          src.startsWith('/media/') ? [[src, correctCaption(caption)]] : [],
        ),
      );

      return { ...migratedCaptions, ...directCaptions };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (activeIndex === null) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setActiveIndex(null);
    }

    document.body.classList.add('media-open');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('media-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeIndex]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === 'mlenester') {
      setIsUnlocked(true);
      setHasError(false);
      return;
    }

    setHasError(true);
  }

  if (!isUnlocked) {
    return (
      <main>
        <section className="login-screen" aria-label="Prisijungimas">
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="password">Slaptažodis</label>
            <div className="login-row">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setHasError(false);
                }}
                autoComplete="current-password"
                autoFocus
              />
              <button type="submit">Įeiti</button>
            </div>
            {hasError && <p className="login-error">Neteisingas slaptažodis.</p>}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="gallery-page">
      <header className="intro">Mano Mamai.....</header>

      <section className="photo-grid" aria-label="Gimtadienio nuotraukų galerija">
        {media.map((item, index) => (
          <figure
            className={`photo ${item.shape}${item.type === 'video' ? '' : ' photo--still'}`}
            key={`${item.src}-${index}`}
            role="button"
            tabIndex={0}
            aria-label={`Atverti prisiminimą ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
          >
            {item.type === 'video' ? (
              <video
                playsInline
                preload="metadata"
                poster={item.poster ? mediaUrl(item.poster) : undefined}
                aria-label="Šeimos vaizdo prisiminimas"
              >
                <source src={mediaUrl(item.src)} type="video/x-m4v" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(item.src)} alt={`Šeimos prisiminimas ${index + 1}`} loading="lazy" />
            )}
          </figure>
        ))}
      </section>

      {activeIndex !== null && (
        <div className="media-focus" role="dialog" aria-modal="true" aria-label="Pasirinktas prisiminimas" onClick={() => setActiveIndex(null)}>
          <div className="media-focus__content" onClick={(event) => event.stopPropagation()}>
            {media[activeIndex].type === 'video' ? (
              <video
                controls
                autoPlay
                playsInline
                poster={media[activeIndex].poster ? mediaUrl(media[activeIndex].poster) : undefined}
              >
                <source src={mediaUrl(media[activeIndex].src)} type="video/x-m4v" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(media[activeIndex].src)} alt={`Šeimos prisiminimas ${activeIndex + 1}`} />
            )}
            {captions[media[activeIndex].src] && (
              <p className="media-caption">{captions[media[activeIndex].src]}</p>
            )}
          </div>
        </div>
      )}

      <footer>
        <span>Nuo Tavo sūnaus Leono.</span>
      </footer>

      <section id="youtube-video" className="youtube-section" aria-label="YouTube vaizdo įrašas">
        <iframe
          src="https://www.youtube-nocookie.com/embed/B3NmMKfl3Ic"
          title="YouTube vaizdo įrašų leistuvė"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </section>
    </main>
  );
}
