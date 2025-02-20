import MoonLoader from "react-spinners/MoonLoader";

export default function FullscreenLoading() {

  return (<>
    {/* fullscreen Loading */}
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.5)",
        zIndex: 999,
      }}
    >
      <MoonLoader type="spin" color='#b23c24' width="4rem" height="4rem" />
    </div>
  </>)
}