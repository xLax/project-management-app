import { render, screen } from '@testing-library/react'
import FormGroup from './FormGroup'

describe('FormGroup', () => {
  it('renders the label with the correct text', () => {
    render(
      <FormGroup label="Email" htmlFor="email">
        <input id="email" />
      </FormGroup>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('associates the label with the child input via htmlFor', () => {
    render(
      <FormGroup label="Email" htmlFor="email-input">
        <input id="email-input" />
      </FormGroup>
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders children inside the group', () => {
    render(
      <FormGroup label="Name" htmlFor="name">
        <input id="name" placeholder="Enter name" />
      </FormGroup>
    )
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
  })

  it('shows "(optional)" hint when optional=true', () => {
    render(
      <FormGroup label="Due Date" htmlFor="due" optional>
        <input id="due" />
      </FormGroup>
    )
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })

  it('does not show "(optional)" hint when optional is not set', () => {
    render(
      <FormGroup label="Title" htmlFor="title">
        <input id="title" />
      </FormGroup>
    )
    expect(screen.queryByText('(optional)')).not.toBeInTheDocument()
  })
})
