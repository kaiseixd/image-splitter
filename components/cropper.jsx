import { useState, useEffect } from 'react'

let moveFlag = false
let dragFlag = false
let dragType = 'nw'

export default function Cropper({ row, col, metaConfig }) {
    const { topBorder, rightBorder, bottomBorder, leftBorder } = metaConfig

    const [blockWidth, setBlockWidth] = useState(1000)
    const [top, setTop] = useState(topBorder)
    const [left, setLeft] = useState(leftBorder)
    const [initLayer, setinitLayer] = useState([])

    useEffect(() => {
        document.addEventListener('mouseup', (e) => {
            moveFlag = false
            dragFlag = false
        })
    }, [])

    useEffect(() => {
        const maxBlockWidth = Math.min((bottomBorder - top) / row, (rightBorder - left) / col)
        setBlockWidth(Math.min(maxBlockWidth, blockWidth))
    }, [row, col])

    function getLayer(e) {
        return [e.nativeEvent.layerX, e.nativeEvent.layerY]
    }

    function onMouseDown(e) {
        moveFlag = true
        setinitLayer(getLayer(e))
    }

    function onDotMouseDown(e, type) {
        dragFlag = true
        dragType = type
        e.stopPropagation()
    }

    function onMouseMove(e) {
        if (moveFlag) {
            const [layerX, layerY] = getLayer(e)
            const [initLayerX, initLayerY] = initLayer

            let calcTop = top + layerY - initLayerY
            let calcLeft = left + layerX - initLayerX

            if (calcTop < topBorder) {
                calcTop = topBorder
            } else if (calcTop + blockWidth * row > bottomBorder) {
                calcTop = bottomBorder - blockWidth * row
            }

            if (calcLeft < leftBorder) {
                calcLeft = leftBorder
            } else if (calcLeft + blockWidth * col > rightBorder) {
                calcLeft = rightBorder - blockWidth * col
            }

            setTop(calcTop)
            setLeft(calcLeft)
        }
    }

    function onWrapperMouseMove(e) {
        if (dragFlag) {
            let maxBlockWidth
            let calcBlockWidth
    
            switch (dragType) {
                case 'se':
                    maxBlockWidth = Math.min((bottomBorder - top) / row, (rightBorder - left) / col)
                    calcBlockWidth = blockWidth + e.nativeEvent.movementX / col
                    break;
                default:
                    break;
            }

            setBlockWidth(Math.min(calcBlockWidth, maxBlockWidth))
        }
    }

    return (
        <div className="wrapper" style={{ backgroundImage: `url(/toko.jpg)` }} onMouseMove={onWrapperMouseMove}>
            <div className="cropper" style={{ top, left }} onMouseDown={onMouseDown} onMouseMove={onMouseMove}>
                <div className="cropper-inner">
                    {/* <span className="nw-dot dot" onMouseDown={(e) => onDotMouseDown(e, 'nw')}></span>
                    <span className="ne-dot dot" onMouseDown={(e) => onDotMouseDown(e, 'ne')}></span>
                    <span className="sw-dot dot" onMouseDown={(e) => onDotMouseDown(e, 'sw')}></span> */}
                    <span className="se-dot dot" onMouseDown={(e) => onDotMouseDown(e, 'se')}></span>
                    {
                        Array(row).fill(1).map((_, index) => <div className="row" key={index} style={{ width: '100%', height: blockWidth }}>
                            {
                                Array(col).fill(1).map((_, index) => <div className="col" key={index} style={{ width: blockWidth, height: blockWidth }}></div>)
                            }
                        </div>)
                    }
                </div>
            </div>
            <style jsx>{`
                .wrapper {
                    width: 600px; 
                    height: 600px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    margin: 0 auto;
                    position: relative;
                }
                .cropper {
                    outline: 1px solid #39f;
                    position: absolute;
                    cursor: move;
                }
                .row {
                    display: flex;
                }
                .col:not(:last-child) {
                    border-right: 1px dashed #3dea04;
                }
                .row:not(:last-child) .col {
                    border-bottom: 1px dashed #3dea04;
                }
                .dot {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #39f;
                }
                .nw-dot {
                    cursor: nw-resize;
                    top: -3px;
                    left: -3px;
                }
                .ne-dot {
                    cursor: ne-resize;
                    top: -3px;
                    right: -3px;
                }
                .sw-dot {
                    cursor: sw-resize;
                    bottom: -3px;
                    left: -3px;
                }
                .se-dot {
                    cursor: se-resize;
                    bottom: -3px;
                    right: -3px;
                }
                * {
                    box-sizing: border-box
                }
            `}</style>
        </div>
    ) 
}
