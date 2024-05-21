import React from 'react'

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  }
}

export default function Loading ({ text = 'جار التحميل', speed = 200 }) {
  const [content, setContent] = React.useState(text)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setContent((content) => {
        return content === `...${text}`
          ? text
          : `.${content}`
      })
    }, speed)

    return () => window.clearInterval(id)
  }, [text, speed])

  return (
    <p style={styles.content}>
     {content} <i className="pi pi-spin pi-spinner" style={{'fontSize': '20px'}}></i>
    </p>
  )
}
