const vars = {
  timeinterval: null,
  endTime: null,
}

const eles = {
  content: document.getElementById('content'),
}

const funcs = {
  getTimeOfTheThing: () => {
    fetch('https://api.timeuntilthething.com')
      .then((response) => response.json())
      .then(({ date }) => {
        vars.endTime = date
        funcs.startCountdown(date)
      })
  },
  getTimeRemaining: (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date())

    return {
      total: Date.parse(endTime) - Date.parse(new Date()),
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
    }
  },
  startCountdown: (date) => {
    const timeRemaining = funcs.getTimeRemaining(date)

    eles.content.innerHTML = tmpls.clock(timeRemaining)

    eles.clock = document.getElementById('clock')
    eles.days = clock.querySelector('.days-container')
    eles.hours = clock.querySelector('.hours-container')
    eles.minutes = clock.querySelector('.minutes-container')
    eles.seconds = clock.querySelector('.seconds-container')

    funcs.updateClock()
    vars.timeinterval = setInterval(funcs.updateClock, 1000)
  },
  updateClock: () => {
    const { total, days, hours, minutes, seconds } = funcs.getTimeRemaining(
      vars.endTime
    )

    eles.days.innerHTML = ('0' + days).slice(-2)
    eles.hours.innerHTML = ('0' + hours).slice(-2)
    eles.minutes.innerHTML = ('0' + minutes).slice(-2)
    eles.seconds.innerHTML = ('0' + seconds).slice(-2)

    if (total <= 0) {
      clearInterval(vars.timeinterval)
    }
  },
}

const tmpls = {
  clock: ({ days, hours, minutes, seconds }) => `
        <div id="clock">
            <div class="days">
                <div class="days-container">${days}</div>
                Days
            </div>
            <div class="hours">
                <div class="hours-container">${hours}</div>
                Hours
            </div>
            <div class="minutes">
                <div class="minutes-container">${minutes}</div>
                Minutes
            </div>
            <div class="seconds">
                <div class="seconds-container">${seconds}</div>
                Seconds
            </div>
        </div>
    `,
}
funcs.getTimeOfTheThing()
