const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((most, item) => item.likes > most.likes ? item : most, blogs[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}