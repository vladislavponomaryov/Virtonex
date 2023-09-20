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
    let customPopoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="virtonex-popover"]'));

    let customPopoverList = customPopoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, {
            customClass: 'virtonex-popover',
        })
    );

})();

export default popover;
