const Avatar = ({ src, size = 36, alt = "avatar" }) => (
  <img
    src={src || `https://placehold.co/${size}x${size}?text=U`}
    alt={alt}
    style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
  />
);

export default Avatar;