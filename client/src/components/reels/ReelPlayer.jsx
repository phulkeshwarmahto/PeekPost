const ReelPlayer = ({ src }) => (
  <video
    src={src}
    controls
    autoPlay
    loop
    playsInline
    style={{ width: "100%", borderRadius: 12, maxHeight: "78vh", background: "#000" }}
  />
);

export default ReelPlayer;