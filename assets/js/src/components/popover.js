/**
 * Popover
 * @requires https://getbootstrap.com
 * @requires https://popper.js.org/
 */

const popover = (() => {

    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

    let popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));


    //let myDefaultAllowList = bootstrap.Tooltip.Default.allowList

    // To allow table elements
    //myDefaultAllowList['*'].push('onclick')

    // custom popover image-uploader
    /*let customPopoverTriggerList = [].slice.call(document.querySelectorAll('[data-image-uploader-popover="popover"]'));

    let customPopoverList = customPopoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'focus',
            placement: 'right',
            html: true,
            customClass: 'custom-visible-popover',
            offset: [59, -30],
            allowList: myDefaultAllowList,
            content: function () {
                return popoverTriggerEl.querySelector('.custom-popover').innerHTML;
            }
        })
    );*/

})();

export default popover;
