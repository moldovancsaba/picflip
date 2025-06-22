export default function AdminDashboard() {
  return (
    <div 
      className="min-h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://i.ibb.co/ZwnSjv3/webbackground-small.png)',
        backgroundRepeat: 'repeat',
      }}
    >
      <iframe
        src="https://api.togetherforvictory.com/backend/backend/slideshow?event-id=1779&slideshow-id=2202&date-from=1748728800000&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjIwMn0.iLS_ebzWrDt665-bUo2FhGN7dNGer2gSvUSfo7Uwfqc"
        width="1920"
        height="1080"
        className="border-0 max-w-full max-h-full"
        allow="fullscreen"
      />
    </div>
  )
}
