interface FormGroupProps {
  label: string
  htmlFor: string
  optional?: boolean
  children: React.ReactNode
}

export default function FormGroup({ label, htmlFor, optional, children }: FormGroupProps) {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>
        {label}
        {optional && <span className="label-optional"> (optional)</span>}
      </label>
      {children}
    </div>
  )
}
