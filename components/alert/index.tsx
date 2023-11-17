type AlertProps ={
    children: React.ReactNode
}
const ALert = ({children}: AlertProps) =>{
    return (
    <div className="p-2 border rounded bg-red-20">{children}</div>
    )
}
export {ALert}