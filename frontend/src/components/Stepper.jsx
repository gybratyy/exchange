export const Stepper = ({ currentStep }) => {
    const steps = ["Registration", "Select your favourite genre", "Select your location"];
    return (
        <div className='mb-8'>
            <ul className="steps w-full">
                {steps.map((step, index) => (
                    <li key={index} className={`step ${index + 1 <= currentStep ? "step-primary" : ""}`}>
                        {step}
                    </li>
                ))}
            </ul>
        </div>
    );
};