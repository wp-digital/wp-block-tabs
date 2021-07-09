export default () => {
  let $tabButton = jQuery('.tabs-headings a');
  
  $tabButton.on('click', function(e) {
    e.preventDefault();
    let $tabButtons = jQuery(this).siblings();
    let $tabContent = jQuery(this).closest('.tabs-wrapper').find('.tabs-content');

    let hash = jQuery(this).attr('href');

    $tabButtons.removeClass('active');
    jQuery(this).addClass('active');

    $tabContent.find('.wp-block-innocode-wp-block-tab').removeClass('active');
    $tabContent.find(`#${hash}`).addClass('active');
  });
};
