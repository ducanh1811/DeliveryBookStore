import React from 'react'

const useDebounce = (value, delay = 500) => {

    const [debounceValue, setDebounceValue] = React.useState(value)

    React.useEffect(() => {

        const id = setTimeout(() => {

            setDebounceValue(value)
        }, delay)

        return () => {
            clearTimeout(id)
        }
    }, [value, delay])

    return debounceValue
}

export default useDebounce