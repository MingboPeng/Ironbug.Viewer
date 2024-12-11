import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import CustomShapeExample from './components/shape'
import ShapeWithTldrawStylesExample from './components/shapeStyle'
// import App from './components/viewer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <CustomShapeExample /> */}
    {/* <App></App> */}
    <ShapeWithTldrawStylesExample></ShapeWithTldrawStylesExample>
  </StrictMode>,
)
