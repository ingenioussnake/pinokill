const showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
});

const showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

const showModel = (title, content, success) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false,
        success: res => res.confirm && success && success()
    });
};

module.exports = {
    showBusy, showSuccess, showModel
}
