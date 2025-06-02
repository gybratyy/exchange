import React from 'react';

export const Stepper = ({currentStep}) => {
    const steps = ["Registration", "Select your favourite genre", "Select your location"];

    return (
        <div className="flex flex-row items-center justify-center p-4 ">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300
                ${
                                currentStep === index + 1
                                    ? 'bg-green-500 text-white'
                                    : currentStep > index + 1
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {index + 1}
                        </div>


                        <div
                            className={`ml-2 text-lg font-medium transition-colors duration-300
                ${
                                currentStep === index + 1
                                    ? 'text-black'
                                    : 'text-gray-600'
                            }`}
                        >
                            {step}
                        </div>
                    </div>


                    {index < steps.length - 1 && (
                        <div
                            className={`w-[100px] h-0.5 mx-4 transition-colors duration-300
                ${
                                currentStep > index + 1
                                    ? 'bg-green-500' // Completed line
                                    : 'bg-gray-300' // Inactive line
                            }`}
                        ></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
