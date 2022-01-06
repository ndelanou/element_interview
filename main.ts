function* chunks<T> (arr: Array<T>, n: number) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}






const args = process.argv.slice(2)

if (args.length < 0) { throw 'No time given' }

const currentTime = args[0];
const currentTimeElements = currentTime.split(':')
const currentTimeHours = parseInt(currentTimeElements[0])
const currentTimeMinutes = parseInt(currentTimeElements[1])

const crons = [...chunks(args.slice(1), 3)]

crons.forEach(cron => {
    const cronHoursStr = cron[1], cronMinutesStr = cron[0]
    const cronHours = parseInt(cronHoursStr), cronMinutes = parseInt(cronMinutesStr)
    var resolvedHours: number, resolvedMinutes: number

    // Determine if hours and minutes are matching
    const isHoursMatching = cronHoursStr == '*' || cronHours == currentTimeHours
    const isMinutesMatching = cronMinutesStr == '*' || cronMinutes == currentTimeMinutes

    // OO:OO
    if (isHoursMatching && isMinutesMatching) {
        resolvedHours = currentTimeHours
        resolvedMinutes = currentTimeMinutes
    }

    // OO:XX
    else if (isHoursMatching && !isMinutesMatching) {
        if (cronHoursStr == '*' && cronMinutes < currentTimeMinutes) {
            resolvedHours = (currentTimeHours + 1) % 24
        } else {
            resolvedHours = currentTimeHours
        }
        resolvedMinutes = cronMinutes
    }
    
    // XX:OO
    else if (!isHoursMatching && isMinutesMatching) {
        resolvedHours = cronHours
        if (cronMinutesStr == '*') {
            resolvedMinutes = 0
        } else {
            resolvedMinutes = cronMinutes
        }
    }

    // XX:XX
    else {
        resolvedHours = cronHours
        resolvedMinutes = cronMinutes
    }

    const isToday = resolvedHours >= currentTimeHours && (resolvedHours != currentTimeHours || resolvedMinutes >= currentTimeMinutes)
    const day = isToday ? 'today' : 'tomorrow'
    
    const resolvedHoursStr = resolvedHours.toString().padStart(2, '0')
    const resolvedMinutesStr = resolvedMinutes.toString().padStart(2, '0')
    const time = `${resolvedHoursStr}:${resolvedMinutesStr}`

    console.log(`${time} ${day} - ${cron[2]}`)
})