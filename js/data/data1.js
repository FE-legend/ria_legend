/**
 * Created by Administrator on 2015/7/20.
 */

var data = {
    getItem: function(id) {
        return JSON.parse(localStorage.getItem(id));
    },
    setItem: function(id, obj) {
        obj = JSON.stringify(obj);
        localStorage.setItem(id, obj);
    },
    removeItem: function(id) {
        localStorage.removeItem(id);
    }
};
