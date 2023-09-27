export async function fileToBase64String(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result?.toString() ?? '')
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function base64StringToFile(base64String: string) {
  const res = await fetch(base64String)
  const blob = await res.blob()
  return new File([blob], 'file', { type: blob.type })
}

export async function base64StringToBlob(base64String: string) {
  const res = await fetch(base64String)
  return await res.blob()
}
