import './modal.scss'
import * as React from 'react'

type Props = {
  open?: boolean
}

export const Modal: React.FunctionComponent<Props> = ({ open, children }) => {
  const modalMod = open === true ? 'modal--show' : 'modal--hide'
  return (
    <div className={`modal ${modalMod}`}>
      <div className="modal__overlay"></div>
      <div className="modal__container">{children}</div>
    </div>
  )
}

export const Header: React.FunctionComponent = ({ children }) => {
  return <div className="modal__header">{children}</div>
}

export const Body: React.FunctionComponent = ({ children }) => {
  return (
    <div className="modal__body">
      <div className="modal__content">{children}</div>
    </div>
  )
}

export const Footer: React.FunctionComponent = ({ children }) => {
  return (
    <div className="modal__footer">
      <div className="modal__content">{children}</div>
    </div>
  )
}
