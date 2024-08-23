export const blurFunc = {
    IfOver18: (isPostOver18) => {
        let blurSetting = JSON.parse(localStorage.getItem("blur_nsfw"))
        if (blurSetting === true && isPostOver18 === true)
            return 'blur(32px)'

        return ''  
     }
 }

