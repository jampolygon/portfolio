/*filters*/

let sr = null

const tabs = document.querySelectorAll('[data-target]'),
    tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tc => {
            tc.classList.remove('filters__active')
        })
        target.classList.add('filters__active')

        tabs.forEach(t => {
            t.classList.remove('filter-tab-active')
        })
        tab.classList.add('filter-tab-active')
    })
})

/*project detail*/
const projectTriggers = document.querySelectorAll('[data-project-open]')
const projectPanels = document.querySelectorAll('[data-project-panel]')
const projectCloseButtons = document.querySelectorAll('[data-project-close]')
const projectSlideshows = new Map()

const setActiveSlide = (panel, nextIndex = 0) => {
    const slides = panel.querySelectorAll('.project-detail__slide')
    const dots = panel.querySelectorAll('.project-detail__dot')

    if (!slides.length) {
        return
    }

    slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === nextIndex)
    })

    dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === nextIndex)
    })
}

const stopProjectSlideshow = panel => {
    const panelId = panel.dataset.projectPanel
    const activeTimer = projectSlideshows.get(panelId)

    if (activeTimer) {
        clearInterval(activeTimer)
        projectSlideshows.delete(panelId)
    }
}

const startProjectSlideshow = panel => {
    const panelId = panel.dataset.projectPanel
    const slides = panel.querySelectorAll('.project-detail__slide')

    stopProjectSlideshow(panel)
    setActiveSlide(panel, 0)

    if (slides.length <= 1) {
        return
    }

    let currentIndex = 0

    const timer = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length
        setActiveSlide(panel, currentIndex)
    }, 2600)

    projectSlideshows.set(panelId, timer)
}

const closeProjectPanels = () => {
    projectPanels.forEach(panel => {
        stopProjectSlideshow(panel)
        panel.classList.remove('is-open')
        panel.setAttribute('aria-hidden', 'true')
    })
    document.body.classList.remove('project-detail-open')
}

const openProjectPanel = projectId => {
    const panel = document.querySelector(`[data-project-panel="${projectId}"]`)

    if (!panel) {
        return
    }

    projectPanels.forEach(item => {
        item.classList.remove('is-open')
        item.setAttribute('aria-hidden', 'true')
    })

    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    document.body.classList.add('project-detail-open')
    startProjectSlideshow(panel)
}

projectTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        openProjectPanel(trigger.dataset.projectOpen)
    })

    if (trigger.tabIndex >= 0 && trigger.tagName !== 'BUTTON') {
        trigger.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openProjectPanel(trigger.dataset.projectOpen)
            }
        })
    }
})

projectCloseButtons.forEach(button => {
    button.addEventListener('click', closeProjectPanels)
})

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeProjectPanels()
    }
})

/*dark/light mode*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark theme
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*scroll reveal*/
if (typeof ScrollReveal !== 'undefined') {
    sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2500,
        delay: 400,
        reset: false
    })

    sr.reveal('.profile__border')
    sr.reveal('.profile__name', {delay: 500})
    sr.reveal('.profile__profession', {delay: 600})
    sr.reveal('.profile__socials', {delay: 700})
    sr.reveal('.profile__info-group', {interval: 100, delay: 800})
    sr.reveal('.profile__buttons', {delay: 800})
    sr.reveal('.profile__buttons-small', {delay: 900})
    sr.reveal('.filters__content', {delay: 900})
    sr.reveal('.filters', {delay: 1000})
    sr.reveal('.projects__card', {delay: 1100})
}
