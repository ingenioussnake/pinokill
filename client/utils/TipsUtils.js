const showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
});

const showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

const showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

module.exports = {
    showBusy, showSuccess, showModel
}
