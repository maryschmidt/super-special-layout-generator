interface TransformersProps {
    count: number;
}

const Transformers = ({ count }: TransformersProps) => {
    const deviceClasses = [];
    for (let i = 0; i < count; i++) {
        deviceClasses.push("ten")
    }
    return deviceClasses.map((c, index) => <div key={`transformer-${index}`} className={c} />)
}

export default Transformers