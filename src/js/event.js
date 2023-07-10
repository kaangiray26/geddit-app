// event.js
import { LocalNotifications } from '@capacitor/local-notifications'

async function open_image_viewer(src) {
    window.dispatchEvent(new CustomEvent('image_viewer', { detail: src }))
}

async function open_gallery_viewer(src) {
    window.dispatchEvent(new CustomEvent('gallery_viewer', { detail: src }))
}

async function notify(title, body) {
    let permission = await LocalNotifications.checkPermissions();
    if (!permission || permission.display != 'granted') {
        await LocalNotifications.requestPermissions();
        return
    }

    await LocalNotifications.schedule({
        notifications: [
            {
                title: title,
                body: body,
                id: 1,
                smallIcon: "logo",
                schedule: { at: new Date(Date.now() + 1000) }
            }
        ]
    })
}

export { open_image_viewer, open_gallery_viewer, notify }