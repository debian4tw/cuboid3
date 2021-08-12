import React,{ FC, useState } from "react";
import { EventHandler } from '@cuboid3/core';

export const MouseSensitivity: FC = () => {

  const [sensitivity, setSensitivity] = useState(1)

  const requestSetCameraParams = (sensi: string) => {
    if (typeof sensitivity !== "undefined") {
      setSensitivity(parseFloat(sensi))
    }
    EventHandler.publish('client:setMouseSensitivity', sensitivity)
  }

  return (
    <div className="mouseSensitivity">
    <p><b>Mouse</b></p>
    <div className="slidecontainer">
      Sensitivity: {sensitivity}
      <input  onChange={(e) => {requestSetCameraParams(e.target.value)}} type="range" min="0.1" max="2" defaultValue="1" step="0.1" value={sensitivity} id="myRange" />
    </div>
    </div>
  )
}
