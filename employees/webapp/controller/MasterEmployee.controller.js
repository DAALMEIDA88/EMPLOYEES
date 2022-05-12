sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {

            this._bus = sap.ui.getCore().getEventBus();


        };

        function onFilter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.Contains, oJSONCountries.EmployeeId));

            }

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));

            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");

        };

        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);

        };

        function onShowCity() {

            var oJSONConfig = this.getView().getModel("jsonConfig");
            oJSONConfig.setProperty("/visibleCity", true);
            oJSONConfig.setProperty("/visibleBtnShowCity", false);
            oJSONConfig.setProperty("/visibleBtnHideCity", true);

        };

        function onHideCity() {
            var oJSONConfig = this.getView().getModel("jsonConfig");
            oJSONConfig.setProperty("/visibleCity", false);
            oJSONConfig.setProperty("/visibleBtnShowCity", true);
            oJSONConfig.setProperty("/visibleBtnHideCity", false);
        };

        function onShowOrders(oEvent) {

            var ordersTable = this.getView().byId("ordersTable");
            ordersTable.destroyItems();

            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("odataNorthwind");

            var objectContext = oContext.getObject();
            var orders = objectContext.Orders;

            var ordersItems = [];

            for (var i in orders) {

                ordersItems.push(new sap.m.ColumnListItem({

                    cells: [
                        new sap.m.Label({ text: orders[i].OrderID }),
                        new sap.m.Label({ text: orders[i].Freight }),
                        new sap.m.Label({ text: orders[i].ShipAddress })
                    ]

                }));

            };

            var newTable = new sap.m.Table({
                width: "auto",
                columns: [
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) }),
                ],
                items: ordersItems
            }).addStyleClass("sapUiSmallMargin");

            // Añade la primera tabla
            ordersTable.addItem(newTable); 


            // Añade la segunda tabla
            var newTableJASON = new sap.m.Table();
            newTableJASON.setWidth("auto");
            newTableJASON.addStyleClass("sapUiSmallMargin");

            var columnOrderID = new sap.m.Column();
            var labelOrderID  = new sap.m.Label();
            labelOrderID.bindProperty("text","i18n>orderID");
            columnOrderID.setHeader(labelOrderID);
            newTableJASON.addColumn(columnOrderID);

            var columnFreight = new sap.m.Column();
            var labelFreight  = new sap.m.Label();
            labelFreight.bindProperty("text","i18n>freight");
            columnFreight.setHeader(labelFreight);
            newTableJASON.addColumn(columnFreight);

            var columnShipAddress = new sap.m.Column();
            var labelShipAddress  = new sap.m.Label();
            labelShipAddress.bindProperty("text","i18n>shipAddress");
            columnShipAddress.setHeader(labelShipAddress);
            newTableJASON.addColumn(columnShipAddress); 
            
            
            var columnListItem = new sap.m.ColumnListItem();

            var cellOrderID = new sap.m.Label();
            cellOrderID.bindProperty("text","jsonEmployees>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text","jsonEmployees>Freight");
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text","jsonEmployees>ShipAddress");
            columnListItem.addCell(cellShipAddress);            

            var oBindingInfo = {
                 model: "jsonEmployees" ,
                 path: "Orders",
                 template: columnListItem
            }

            newTableJASON.bindAggregation("items",oBindingInfo);
            newTableJASON.bindElement("jsonEmployees>" + oContext.getPath());

            ordersTable.addItem(newTableJASON);

        };

        function onShowOrders2(oEvent) {
            // Get Selected Controller
            var iconPressed = oEvent.getSource();

            //Context from model
            var oContext = iconPressed.getBindingContext("odataNorthwind");
           
            if(!this._oDialogOrders){
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders",this);
                this.getView().addDependent(this._oDialogOrders);
            };

           //Dialog binding to context and access to data of selected items
           this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
           this._oDialogOrders.open();
        }; 
        
        function onCloseOrders(){
            this._oDialogOrders.close();
        };

        function showEmployee(oEvent){
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible","showEmployee", path);
        };

        var Main = Controller.extend("logaligroup.employees.controller.MasterEmployee", {});
        Main.prototype.onValidate = function () {
            var inputEmpployee = this.byId("inputEmployee");
            var valueEmployee = inputEmpployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmpployee.setDescription("OK");
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            } else {
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            }
        };



        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.onShowOrders = onShowOrders;
        Main.prototype.onShowOrders2 = onShowOrders2;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
        return Main;

    });
