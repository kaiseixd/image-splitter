import { useState } from 'react'
import { getMetaConfig } from '../common/utils'
import Cropper from '../components/cropper'

function Page({ image, metadata }) {
    const [col, setCol] = useState(3)
    const [row, setRow] = useState(3)

    const metaConfig = getMetaConfig(metadata)

    return <div>
        行：<input type="number" value={col} onChange={e => setCol(getSafeValue(e))} />
        <br />
        列：<input type="number" value={row} onChange={e => setRow(getSafeValue(e))} />
        { image && <Cropper src={`data:image/ipeg;base64,${image}`} row={row} col={col} metaConfig={metaConfig} />}
    </div>
}

function getSafeValue(e) {
    const value = e.target.value
    return value > 0
        ? value > 50
            ? 50
            : Number(value)
        : 1
}

Page.getInitialProps = async ({ req }) => {
    const imageRes = await fetch('http://localhost:3001/image/get')
    const metadataRes = await fetch('http://localhost:3001/image/metadata')
    const image = await imageRes.json()
    const metadata = await metadataRes.json()

    return { image, metadata: metadata.result.metadata }
}

export default Page