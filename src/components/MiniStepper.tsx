import React from 'react'
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react'

export interface Step {
  id: string
  label: string
  status: 'idle' | 'active' | 'done' | 'error'
}

interface MiniStepperProps {
  steps?: Step[]
  className?: string
}

const StepIcon: React.FC<{ status: Step['status'] }> = ({ status }) => {
  const iconProps = "h-4 w-4"
  
  switch (status) {
    case 'done':
      return <CheckCircle className={`${iconProps} text-nova-success`} />
    case 'active':
      return <Clock className={`${iconProps} text-primary`} />
    case 'error':
      return <AlertCircle className={`${iconProps} text-nova-error`} />
    default:
      return <Circle className={`${iconProps} text-muted-foreground`} />
  }
}

const StepConnector: React.FC<{ isDone: boolean; isActive: boolean }> = ({ isDone, isActive }) => (
  <div className={`h-0.5 flex-1 transition-colors duration-nova ${
    isDone || isActive ? 'bg-primary' : 'bg-muted-foreground/30'
  }`} />
)

export const MiniStepper: React.FC<MiniStepperProps> = ({ 
  steps = defaultSteps, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center space-y-2">
            <StepIcon status={step.status} />
            <span className={`text-xs font-medium transition-colors duration-nova ${
              step.status === 'active' ? 'text-primary' : 
              step.status === 'done' ? 'text-nova-success' :
              step.status === 'error' ? 'text-nova-error' :
              'text-muted-foreground'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <StepConnector 
              isDone={step.status === 'done'} 
              isActive={step.status === 'active'} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export const defaultSteps: Step[] = [
  { id: 'start', label: 'Start', status: 'idle' },
  { id: 'pay', label: 'Pay', status: 'idle' },
  { id: 'authenticate', label: 'Authenticate', status: 'idle' },
  { id: 'settle', label: 'Settle', status: 'idle' },
]