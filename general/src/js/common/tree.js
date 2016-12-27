+ function($) {
    'use strict';


 var ztreeSidebar = function(element, zNodes, setting) {
        this.$element = $(element);
        this.beforeClick = this.beforeClick.bind(this);
        this.addDiyDom = this.addDiyDom.bind(this);
        this.zNodes = zNodes;
        this.defaultSetting = {
            diyClass: {
                nodeDir: "icon-u-right-dir",
                nodeOpenDir: "icon-u-down-dir",
                nodeSwitch: "ztree-switch",
                nodeParent: 'ztree-parent',
                nodeIcon: "ztree-icon",
                node: "ztree-node"
            },
            diySetting:{
                accordion:true,
                collapse:true
            },
            view: {
                addDiyDom: this.addDiyDom,
                dblClickExpand: false,

            },
            callback: {
                beforeClick: this.beforeClick

            }
        };
        this.setting = $.extend(true, this.defaultSetting, setting);
        this.zTree = $.fn.zTree.init(this.$element, this.setting, this.zNodes);
    };
    ztreeSidebar.prototype.update = function(zNodes, setting) {
        this.zTree.destroy();
        this.zNodes = zNodes;
        this.setting = $.extend(true, this.defaultSetting, setting);
        this.zTree = $.fn.zTree.init(this.$element, this.setting, this.zNodes);
    };



    ztreeSidebar.prototype.beforeClick = function(treeId, treeNode) {



        if (this.setting.diySetting.accordion) {
            var nodes = this.zTree.getNodesByParam("open", true, null);


            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] && nodes[i].tId != treeNode.tId && nodes[i].level == treeNode.level) {

                    this.zTree.expandNode(nodes[i], false, false, true, true);
                    $("#" + nodes[i].tId + "_a ." + this.setting.diyClass.nodeSwitch).toggleClass(this.setting.diyClass.nodeDir + " " + this.setting.diyClass.nodeOpenDir);
                }
            }
        }


        if (treeNode.isParent&&this.setting.diySetting.collapse) {

            this.zTree.expandNode(treeNode);

            var iconSwitch = $("#" + treeNode.tId + "_a ." + this.setting.diyClass.nodeSwitch);
            iconSwitch.toggleClass(this.setting.diyClass.nodeDir + " " + this.setting.diyClass.nodeOpenDir);

            return false;
        } else {
            return true;
        }
    };

    ztreeSidebar.prototype.addDiyDom = function(treeId, treeNode) {

        var aObj = $("#" + treeNode.tId + "_a");
        if (treeNode.isParent) {
            aObj.addClass(this.setting.diyClass.nodeParent);
        } else {
            aObj.addClass(this.setting.diyClass.node);
        }
        aObj.find(".button").remove();
        var iconDom = "<i class='" + treeNode.icon + " " + this.setting.diyClass.nodeIcon + "'></i>";

        aObj.prepend(iconDom);
        aObj.append(treeNode.extend);
        if (treeNode.isParent) {
            var swithDom = "<i class='" + (treeNode.open ? this.setting.diyClass.nodeOpenDir : this.setting.diyClass.nodeDir) + " " + this.setting.diyClass.nodeSwitch + "'></i>";
            aObj.append(swithDom);
        }

        if (treeNode.active) {
            var that = this;
            setTimeout(function() {
                var node = that.zTree.getNodeByTId(treeNode.tId);
                that.zTree.selectNode(node);
            }, 0);
        }

    };



    var plugIn = function(zNodes, setting) {
        var $this = $(this);
        var data = $this.data("ztreeSidebar");
        if (!data) {
            $this.data("ztreeSidebar", (data = new ztreeSidebar(this, zNodes, setting)));
        } else {
            data.update(zNodes, setting);
        }

        if (typeof zNodes == "undefined") {
            return data.zTree;
        } else {
            return this;
        }
    };

    $.fn.ztreeSidebar = plugIn;

}(jQuery);
