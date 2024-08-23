import "../css/NFTCard.css";

export default function NFTCard({ name, image, description }) {
  return (
    <div className="card">
      <img src={image} alt={name} className="card-image" />
      <h2 className="card-name">{name}</h2>
      <p className="card-description">{description}</p>
    </div>
  );
}
