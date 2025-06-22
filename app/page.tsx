export default function Home() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
    }}>
      <iframe 
        src="https://api.seyu.hu/backend/backend/slideshow?event-id=1770&slideshow-id=2193&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjE5M30.ETeIQ8XOeUcvRBsxxLES3ENciJ_ziBScckn16J6ehHY"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allowFullScreen
      />
    </main>
  );
}
