export default function Label({
  title,
  name,
  type = "text",
  options,
  rows = 0,
  required = true,
  defaultChecked = false,
  ...rest
}) {
  const hasOptions = Array.isArray(options) && options.length > 0;
  const isTextarea = rows > 0;
  const isCheckbox = type === "checkbox";

  let input; 

  if(hasOptions){
    input = (       
      <select className="input" name={name} required={required} {...rest}>
        {options.map((opt) => (
          <option key={String(opt)} value={opt}>
            {opt}
          </option>
        ))}
      </select>)
  } else if(isTextarea){
    input = (       
      <textarea className="input" rows={rows} name={name} required={required} {...rest} />
    )
  } else if(isCheckbox){
    input = (       
      <input type={type} name={name} className="checkbox" defaultChecked={defaultChecked} />
    )
  } else {
    input = (        
      <input
          className="input"
          type={type}
          name={name}
          required={required}
          {...rest}
      />
    )
  }

  return (
    <div>
      <label className="label" htmlFor={name}>{title}</label>
      {input}
    </div>
  );
}
