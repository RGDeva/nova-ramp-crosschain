import React from 'react'
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Step {
  id: string
  label: string
  status: 'idle' | 'active' | 'done' | 'error'
}

interface InlineStepperProps {
  steps: Step[]
  className?: string
}

const StepIcon: React.FC<{ status: Step['status'] }> = ({ status }) => {
  switch (status) {
    case 'done':
      return <CheckCircle className="h-5 w-5 text-nova-success" />
    case 'active':
      return <Clock className="h-5 w-5 text-nova-primary animate-pulse" />
    case 'error':
      return <AlertCircle className="h-5 w-5 text-nova-error" />
    default:
      return (
        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground bg-transparent" />
      )
  }
}

const StepConnector: React.FC<{ isActive: boolean; isDone: boolean }> = ({ isActive, isDone }) => (
  <div className="flex-1 h-0.5 mx-2">
    <div
      className={`h-full transition-all duration-300 ${
        isDone
          ? 'bg-nova-success'
          : isActive
          ? 'bg-gradient-to-r from-nova-primary to-muted-foreground'
          : 'bg-muted-foreground/30'
      }`}
    />
  </div>
)

export const InlineStepper: React.FC<InlineStepperProps> = ({ steps, className = '' }) => {
  return (
    <Card className={`bg-gradient-surface border-border/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2 min-w-0">
                <StepIcon status={step.status} />
                <span
                  className={`text-xs font-medium text-center px-2 ${
                    step.status === 'done'
                      ? 'text-nova-success'
                      : step.status === 'active'
                      ? 'text-nova-primary'
                      : step.status === 'error'
                      ? 'text-nova-error'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <StepConnector
                  isActive={step.status === 'active'}
                  isDone={step.status === 'done'}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Default steps for onramp flow
export const defaultOnrampSteps: Step[] = [
  { id: 'start', label: 'Start', status: 'idle' },
  { id: 'pay', label: 'Pay off-chain', status: 'idle' },
  { id: 'auth', label: 'Authenticate', status: 'idle' },
  { id: 'prove', label: 'Generate Proof', status: 'idle' },
  { id: 'fulfill', label: 'Fulfill', status: 'idle' },
]