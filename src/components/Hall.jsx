export default function Hall({ id, mark, name, site, description, topics, children }) {
  return (
    <article className="hall" id={id}>
      <div className="hall-head">
        <span className="mark">{mark}</span>
        <h3>{name}</h3>
        <p className="site">{site}</p>
      </div>
      <div className="hall-body">
        <p>{description}</p>
        <ul className="topics">
          {topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {children}
      </div>
    </article>
  );
}
