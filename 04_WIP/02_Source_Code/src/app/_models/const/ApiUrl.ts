export class ApiUrl {
  // System
  static employee_GetByCode = 'api/system/Employee_GetByCode';
  static employee_GetByUsername = 'api/system/Employee_GetByUsername';
  static checkPermission = 'api/system/CheckPermission';
  static calendarMonth_GetAll = 'api/system/CalendarMonth_GetAll';
  // System account
  static userLogin = 'api/system/Login';
  static userChangePassword = 'api/system/ChangePassword';
  // Supplier
  static supplier_GetAll = 'api/PPM_Supplier/Supplier_GetAll';
  static supplier_GetByID = 'api/PPM_Supplier/Supplier_GetByID';
  static supplier_Create = 'api/PPM_Supplier/Supplier_Create';
  static supplier_Edit = 'api/PPM_Supplier/Supplier_Edit';
  static supplier_Delete = 'api/PPM_Supplier/Supplier_Delete';
  static Supplier_History = 'api/PPM_Supplier/Supplier_History';
  // Supplier Mistake
  static supplierMistake_GetList = 'api/PPM_Supplier/SupplierMistake_GetList';
  static supplierMistake_GetAll = 'api/PPM_Supplier/SupplierMistake_GetAll';
  static supplierMistake_GetByID = 'api/PPM_Supplier/SupplierMistake_GetByID';
  static supplierMistake_Create = 'api/PPM_Supplier/SupplierMistake_Create';
  static supplierMistake_Edit = 'api/PPM_Supplier/SupplierMistake_Edit';
  static supplierMistake_Delete = 'api/PPM_Supplier/SupplierMistake_Delete';
  // Mistake
  static mistakeType_GetAll = 'api/PPM_Supplier/MistakeType_GetAll';
  static mistakeType_GetByID = 'api/PPM_Supplier/MistakeType_GetByID';
  static mistakeType_Create = 'api/PPM_Supplier/MistakeType_Create';
  static mistakeType_Edit = 'api/PPM_Supplier/MistakeType_Edit';
  static mistakeType_Delete = 'api/PPM_Supplier/MistakeType_Delete';
  // Contact
  static contact_GetList = 'api/PPM_Supplier/Contact_GetList';
  static contact_GetAll = 'api/PPM_Supplier/Contact_GetAll';
  static contact_GetByID = 'api/PPM_Supplier/Contact_GetByID';
  static contact_Create = 'api/PPM_Supplier/Contact_Create';
  static contact_Edit = 'api/PPM_Supplier/Contact_Edit';
  static contact_Delete = 'api/PPM_Supplier/Contact_Delete';
  // Contract Principles
  static contractPrinciples_GetList = 'api/PPM_Supplier/ContractPrinciples_GetList';
  static contractPrinciples_GetAll = 'api/PPM_Supplier/ContractPrinciples_GetAll';
  static contractPrinciples_GetByID = 'api/PPM_Supplier/ContractPrinciples_GetByID';
  static contractPrinciples_Create = 'api/PPM_Supplier/ContractPrinciples_Create';
  static contractPrinciples_Edit = 'api/PPM_Supplier/ContractPrinciples_Edit';
  static contractPrinciples_Delete = 'api/PPM_Supplier/ContractPrinciples_Delete';
  static contractPrinciples_DownloadFile = 'api/PPM_Supplier/ContractPrinciples_DownloadFile';
  // Supplier Check
  static supplierCheck_GetAll = 'api/PPM_Supplier/SupplierCheck_GetAll';
  static supplierCheck_GetByID = 'api/PPM_Supplier/SupplierCheck_GetByID';
  static supplierCheck_Create = 'api/PPM_Supplier/SupplierCheck_Create';
  static supplierCheck_Edit = 'api/PPM_Supplier/SupplierCheck_Edit';
  static supplierCheck_Delete = 'api/PPM_Supplier/SupplierCheck_Delete';

  static SupplierCheckHistory_Create = 'api/PPM_Supplier/SupplierCheckHistory_Create';
  static SupplierCheckDetail_GetList = 'api/PPM_Supplier/SupplierCheckDetail_GetList';
  static SupplierCheckDetail_DeleteFile = 'api/PPM_Supplier/SupplierCheckDetail_DeleteFile';
  static SupplierCheckDetail_DownloadFile = 'api/PPM_Supplier/SupplierCheckDetail_DownloadFile';
  // Tag
  static tag_GetAll = 'api/PPM_Supplier/Tag_GetAll';
  static tag_Create = 'api/PPM_Supplier/Tag_Create';
  static tag_Delete = 'api/PPM_Supplier/Tag_Delete';
  // Status
  static status_GetAll = 'api/system/Status_GetAll';
  static statusAction_GetAll = 'api/system/StatusAction_GetAll';
  // Unit
  static unit_GetAll = 'api/system/Unit_GetAll';
  static unit_GetByID = 'api/system/Unit_GetByID';
  static unit_Create = 'api/system/Unit_Create';
  static unit_Edit = 'api/system/Unit_Edit';
  // Product Category
  static productCategory_GetAll = 'api/PPM_Product/ProductCategory_GetAll';
  static productCategory_GetByID = 'api/PPM_Product/ProductCategory_GetByID';
  static productCategory_Create = 'api/PPM_Product/ProductCategory_Create';
  static productCategory_Edit = 'api/PPM_Product/ProductCategory_Edit';
  // Product Item
  static productItem_GetAll = 'api/PPM_Product/ProductItem_GetAll';
  static productItem_GetList = 'api/PPM_Product/ProductItem_GetList';
  static productItem_GetByID = 'api/PPM_Product/ProductItem_GetByID';
  static productItem_Create = 'api/PPM_Product/ProductItem_Create';
  static productItem_Edit = 'api/PPM_Product/ProductItem_Edit';
  static productItem_Delete = 'api/PPM_Product/ProductItem_Delete';
  static productItem_UploadAvatar = 'api/PPM_Product/ProductItem_UploadAvatar';
  static generateProductNo = 'api/PPM_Product/GenerateProductNo';
  // PO Master
  static poMaster_GetAll = 'api/PPM_Order/POMaster_GetAll';
  static poMaster_GetByID = 'api/PPM_Order/POMaster_GetByID';
  static poMaster_Create = 'api/PPM_Order/POMaster_Create';
  static poMaster_Edit = 'api/PPM_Order/POMaster_Edit';
  // PO History
  static POMasterDetail_DownloadFile = 'api/PPM_Order/POMasterDetail_DownloadFile';
  static poMasterDetail_DeleteFile = 'api/PPM_Order/POMasterDetail_DeleteFile';
  static poMasterDetail_GetList = 'api/PPM_Order/POMasterDetail_GetList';
  static poHistory_GetList = 'api/PPM_Order/POHistory_GetList';
  static poHistory_Comment = 'api/PPM_Order/POHistory_Create';
  static poActivity_Create = 'api/PPM_Order/POActivity_Create';
  static poActivity_Edit = 'api/PPM_Order/POActivity_Edit';
  static poActivity_GetByID = 'api/PPM_Order/POActivity_GetByID';
  static poActivity_MarkDone = 'api/PPM_Order/POActivity_MarkDone';
  static poActivity_Delete = 'api/PPM_Order/POActivity_Delete';
  static poHistory_UpdateDocument = 'api/PPM_Order/POHistory_UpdateDocument';

  // PR Master
  static prMasterCheck_GetAll = 'api/PPM_Order/PRMasterCheck_GetAll';
  static prMaster_GetAll = 'api/PPM_Order/PRMaster_GetAll';
  static prMaster_GetByID = 'api/PPM_Order/PRMaster_GetByID';
  static prMaster_Create = 'api/PPM_Order/PRMaster_Create';
  static prMaster_Edit = 'api/PPM_Order/PRMaster_Edit';
  static prMaster_Confirm = 'api/PPM_Order/PRMaster_Confirm';
  static prMaster_Return = 'api/PPM_Order/PRMaster_Return';

  // PR Item
  static poItem_UpdateActualReceipt = 'api/PPM_Order/POItem_UpdateActualReceipt';
  static poItem_UpdatePayday = 'api/PPM_Order/POItem_UpdatePayday';
  static prItem_GetList = 'api/PPM_Order/PRItem_GetList';
  static prItem_GetList_ByPR = 'api/PPM_Order/PRItem_GetList_ByPR';
  static prItem_GetList_ByPO = 'api/PPM_Order/PRItem_GetList_ByPO';
  static prItem_GetList_ByInvoice = 'api/PPM_Order/PRItem_GetList_ByInvoice';
  static poItem_GetAll = 'api/PPM_Order/POItem_GetAll';
  static prItem_GetAll = 'api/PPM_Order/PRItem_GetAll';
  static invoiceItem_GetAll = 'api/PPM_Order/InvoiceItem_GetAll';
  static prItem_GetByID = 'api/PPM_Order/PRItem_GetByID';
  static prItem_Create = 'api/PPM_Order/PRItem_Create';
  static prItem_Edit = 'api/PPM_Order/PRItem_Edit';
  static prItem_Delete = 'api/PPM_Order/PRItem_Delete';
  static budgetUseInMonth_Get = 'api/PPM_Order/BudgetUseInMonth_Get';

  // Payment term
  static paymentterm_GetAll = 'api/PPM_Order/Paymentterm_GetAll';
  static paymentterm_GetByID = 'api/PPM_Order/Paymentterm_GetByID';
  static paymentterm_Create = 'api/PPM_Order/Paymentterm_Create';
  static paymentterm_Edit = 'api/PPM_Order/Paymentterm_Edit';

  // Invoice Master
  static invoiceMaster_GetAll = 'api/PPM_Order/InvoiceMaster_GetAll';
  static invoiceMaster_GetByID = 'api/PPM_Order/InvoiceMaster_GetByID';
  static invoiceMaster_Create = 'api/PPM_Order/InvoiceMaster_Create';
  static invoiceMaster_Edit = 'api/PPM_Order/InvoiceMaster_Edit';

  static invoiceHistory_Create = 'api/PPM_Order/InvoiceHistory_Create';
  static invoiceDetail_GetList = 'api/PPM_Order/InvoiceDetail_GetList';
  static invoiceDetail_DeleteFile = 'api/PPM_Order/InvoiceDetail_DeleteFile';
  static invoiceDetail_DownloadFile = 'api/PPM_Order/InvoiceDetail_DownloadFile';

  // Expenses Master
  static expensesMaster_GetAll = 'api/PPM_Expenses/ExpensesMaster_GetAll';
  static expensesMaster_GetByID = 'api/PPM_Expenses/ExpensesMaster_GetByID';
  static expensesMaster_Create = 'api/PPM_Expenses/ExpensesMaster_Create';
  static expensesMaster_Edit = 'api/PPM_Expenses/ExpensesMaster_Edit';

  // Export Request
  static ERMaster_GetAll = 'api/PPM_Order/ERMaster_GetAll';
  static ERMaster_GetByID = 'api/PPM_Order/ERMaster_GetByID';
  static ERMaster_Create = 'api/PPM_Order/ERMaster_Create';
  static ERMaster_Edit = 'api/PPM_Order/ERMaster_Edit';
  static ERMasterCheck_GetAll = 'api/PPM_Order/ERMasterCheck_GetAll';
  static ERMaster_Confirm = 'api/PPM_Order/ERMaster_Confirm';
  static ERMaster_Return = 'api/PPM_Order/ERMaster_Return';

  // Export Order
  static EOMaster_GetAll = 'api/PPM_Order/EOMaster_GetAll';
  static EOMaster_GetByID = 'api/PPM_Order/EOMaster_GetByID';
  static EOMaster_Create = 'api/PPM_Order/EOMaster_Create';
  static EOMaster_Edit = 'api/PPM_Order/EOMaster_Edit';

  // Export Item
  static ERItem_GetList_ByER = 'api/PPM_Order/ERItem_GetList_ByER';
  static ERItem_GetList_ByEO = 'api/PPM_Order/ERItem_GetList_ByEO';
  static ERItem_GetAll_ByER = 'api/PPM_Order/ERItem_GetAll_ByER';
  static ERItem_GetAll_ByEO = 'api/PPM_Order/ERItem_GetAll_ByEO';

  // Jig
  static jigType_GetByDrawingNo = 'api/Jig/JigType_GetByDrawingNo';

  //Report
  static ReportPurchase_ByProductCategory = 'api/PPM_Report/ReportPurchase_ByProductCategory';
  
  //Data Form
  static GetDataFormFixAssetItemList = 'api/PPM_DataForm/GetDataFormFixAssetItemList';
  static GetDataFormFixAssetItemCreate = 'api/PPM_DataForm/GetDataFormFixAssetItemCreate';

  static GetDataForm_ProductCategoryList = 'api/PPM_DataForm/GetDataFormProductCategoryList';
  static GetDataForm_ProductItemList = 'api/PPM_DataForm/GetDataFormProductItemList';
  static GetDataForm_ProductItemCreate = 'api/PPM_DataForm/GetDataFormProductItemCreate';

  static GetDataFormRackGroupCreate = 'api/SYS_DataForm/GetDataFormRackGroupCreate';
  static GetDataFormRackGroupList = 'api/SYS_DataForm/GetDataFormRackGroupList';
  static GetDataFormRackItemCreate = 'api/SYS_DataForm/GetDataFormRackItemCreate';
  static GetDataFormRackItemList = 'api/SYS_DataForm/GetDataFormRackItemList';

  static GetDataForm_PRMasterCheck = 'api/PPM_DataForm/GetDataFormPRMasterCheck';
  static GetDataForm_POMasterHistory = 'api/PPM_DataForm/GetDataFormPOMasterHistory';
  static GetDataForm_POMasterList = 'api/PPM_DataForm/GetDataFormPOMasterList';
  static GetDataForm_PRMasterList = 'api/PPM_DataForm/GetDataFormPRMasterList';
  static GetDataForm_PRItemCreate = 'api/PPM_DataForm/GetDataFormPRItemCreate';
  static GetDataForm_POMasterCreate = 'api/PPM_DataForm/GetDataFormPOMasterCreate';
  static GetDataForm_InvoiceCreate = 'api/PPM_DataForm/GetDataFormInvoiceCreate';
  static GetDataForm_InvoiceList = 'api/PPM_DataForm/GetDataFormInvoiceList';
  static GetDataForm_InvoiceItemList = 'api/PPM_DataForm/GetDataFormInvoiceItemList';

  static GetDataForm_SupplierCreate = 'api/PPM_DataForm/GetDataFormSupplierCreate';
  static GetDataForm_ContactCreate = 'api/PPM_DataForm/GetDataFormContactCreate';
  static GetDataForm_SupplierMistakeList = 'api/PPM_DataForm/GetDataFormSupplierMistakeList';
  static GetDataForm_SupplierMistakeCreate = 'api/PPM_DataForm/GetDataFormSupplierMistakeCreate';

  static GetDataForm_ExpensesMasterList = 'api/PPM_DataForm/GetDataFormExpensesMasterList';
  static GetDataForm_SupplierCheckCreate = 'api/PPM_DataForm/GetDataFormSupplierCheckCreate';

  static GetDataFormERMasterList = 'api/PPM_DataForm/GetDataFormERMasterList';
  static GetDataFormERMasterCreate = 'api/PPM_DataForm/GetDataFormERMasterCreate';
  static GetDataFormEOMasterList = 'api/PPM_DataForm/GetDataFormEOMasterList';
  static GetDataFormEOMasterCreate = 'api/PPM_DataForm/GetDataFormEOMasterCreate';
  static GetDataFormERMasterCheckList = 'api/PPM_DataForm/GetDataFormERMasterCheckList';

  static GetDataForm_ReportPurchaseByProductCategory = 'api/PPM_DataForm/GetDataFormReportPurchaseByProductCategory';


  static GetListFile_ByFolder = 'api/common/GetListFile_ByFolder';

  static UploadFile = 'api/common/UploadFile';

  //
  static requestMaster_GetByID = 'api/request/RequestMaster_GetByID';
  static requestMaster_GetCompBySampleType = 'api/request/RequestMaster_GetCompBySampleType';
  static GetDataForm_RequestCompReport = 'api/dataform/GetDataFormRequestCompReport';
}
