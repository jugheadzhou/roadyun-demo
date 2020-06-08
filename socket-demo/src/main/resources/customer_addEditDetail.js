// 页面属性：客户管理/老客户修改/新客户开户
var page_action = null;
// 操作类型：新增/修改/明细
var action_type = null;
// 抬头Id
var this_HeadsId = null;

var User_corporations = "";
var User_organizations = "";

var CustomerHeads = {};
var Files = [];
var CustomerLinkmans = null;
var CustomerDeliveryAddrs = null;
var ifGetAbilities = false;
var CustomerDistributes = null;
var CustomerMarketings = null;
var CustomerKithOrKins = null;
var CustomerPolicymakers = null;
var CustomerExpectedSales = null;
var CustomerOrganizations = null;
var CustomerCorporationInfos = null;
var CustomerSalesInfos = null;
var CustomerPartnerInfos = null;
// 不同页面点击加载相同内容的地方
var clickWay = "";
var this_object = {};
// 一对多表是否有改动
var isupded = {};

//获取data.properties静态数据
function getConstData() {
	$.ajax({
      	type: "get",
      	url: "../customers/getConstData.html",
      	async: false,
      	dataType: "json",
      	data: {},
   	  	success: function(data) {
   	  		if (data.success === true) {
   	  			ossBasePath = data.ossBasePath + "/";
   	  		} else {
   	  			swalNullFalseMsg("常量信息");
   	  		}
   	  	}, error: function() {
   	  		swalNetErrorMsg("常量信息");
   	  	}
	});
}

// 加载死数据
function loadConstantDatas() {
	var htmls = "";
	htmls = "<li>渠道客户</li><li>全渠道客户</li><li>团购客户</li><li>专营客户</li>";
	// 公司性质
	setDropSel($("#Nature"), htmls);
	// 能力
	htmls = "<li></li><li>好</li><li>较好</li><li>一般</li><li>差</li>";
	setDropSel($("#CustomerSaleCapacity"), htmls);
	setDropSel($("#ManageCapacity"), htmls);

	htmls = "<li>好</li><li>较好</li><li>一般</li><li>差</li>";
	setDropSel($("#CustomerMarketings_GrowthPotential"), htmls);
	$("#CustomerMarketings_GrowthPotential").val("好");
	setDropSel($("#CustomerMarketings_FactoryRelation"), htmls);
	$("#CustomerMarketings_FactoryRelation").val("好");

	htmls = "<li></li><li>是</li><li>否</li>";
	setDropSel($("#IsSaleOurProduct"), htmls);
	setDropSel($("#IsHaveKithOrKin"), htmls);

	htmls = "<li>是</li><li>否</li>";
	setDropSel($("#CustomerDeliveryAddrs_IsStandard"), htmls);
	$("#CustomerDeliveryAddrs_IsStandard").val("否");

	htmls = "<li value = 1>男</li><li value = 0>女</li>";
	setDropSel($("#CustomerLinkman_Gender"), htmls);

	if (page_action == "new" && action_type == "new") {
		$("#Nature").val("渠道客户");
		CustomerHeads.Nature = "渠道客户";
	}
}

// 2019-07-01  cc  IX2FF
function Clone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = Clone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}

// 基础信息
function loadCustomerHeads(this_HeadsId) {
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestheads";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerheads";
		} else {
			json.tableName = "cus_customerrequestheads";
		}
	} else {
		json.tableName = "cus_customerheads";
	}
	json.Id = this_HeadsId;
	$(".await").fadeIn(500);
	$.ajax({
		type: "post",
		url: "../customers/customerHeadsDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
			$(".await").fadeOut(300);
			if (data.success === true) {
				CustomerHeads = data.message;
				this_HeadsId = CustomerHeads.Id;
				if (page_action == "one") {
					if (action_type == "upd") {
						$("#head_Msg_Number").html("一次性客户编辑：" + CustomerHeads.Code);
					} else {
						$("#head_Msg_Number").html("一次性客户明细：" + CustomerHeads.Code);
					}
					$("#head_Msg_Name").html(" - " + CustomerHeads.Name);
					$("#one_Name").val(CustomerHeads.Name);
					$("#one_CustomerTypeName").val(CustomerHeads.CustomerTypeCode + "-" + CustomerHeads.CustomerTypeName);
					$("#one_RegionName").val(CustomerHeads.RegionName);
					$("#one_LegalPerson").val(CustomerHeads.LegalPerson);

					$("#InvoiceTypeName").val(CustomerHeads.InvoiceTypeName);
					$("#InvoiceReceiver").val(CustomerHeads.InvoiceReceiver);
					$("#InvoiceReceiverTele").val(CustomerHeads.InvoiceReceiverTele);
					$("#InvoiceMailAddress").val(CustomerHeads.InvoiceMailAddress);
					$("#TaxId").val(CustomerHeads.TaxId);
					$("#InvoiceTele").val(CustomerHeads.InvoiceTele);
					$("#InvoiceAddress").val(CustomerHeads.InvoiceAddress);
					$("#InvoiceBank").val(CustomerHeads.InvoiceBank);
					$("#InvoiceAccount").val(CustomerHeads.InvoiceAccount);
					$("#InvoiceLocalNumber").val(CustomerHeads.InvoiceLocalNumber);
					if (CustomerHeads.IsNeedTax) {
						$(".NeedTax").show();
						$(".NoNeedTax").hide();
					} else {
						$(".NeedTax").hide();
						$(".NoNeedTax").show();
					}
				} else {
					if (page_action == "new") {
						if (action_type == "upd") {
							$("#head_Msg_Number").html("新客户开户单编辑：" + CustomerHeads.Number);
						} else {
							$("#head_Msg_Number").html("新客户开户单明细：" + CustomerHeads.Number);
						}
					} else if (page_action == "upd") {
						if (action_type == "new") {
							$("#head_Msg_Number").html("修改老客户：" + CustomerHeads.Code);
							CustomerHeads.LastOldName = CustomerHeads.LastOldName ? CustomerHeads.LastOldName : "";
						} else if (action_type == "upd") {
							$("#head_Msg_Number").html("老客户修改单编辑：" + CustomerHeads.Number);
						} else {
							$("#head_Msg_Number").html("老客户修改单明细：" + CustomerHeads.Number);
						}
					} else if (action_type == "manager_edit") {
						$("#head_Msg_Number").html("超管编辑：" + CustomerHeads.Code);
					} else {
						$("#head_Msg_Number").html("客户明细：" + CustomerHeads.Code);
					}
					if (CustomerHeads.IsOneTime) {
						$("#CustomerCorporationInfos_panel").attr("class", "notAllow");
						$("#CustomerSalesInfos_panel").attr("class", "notAllow");
						$("#CustomerPartnerInfos_panel").attr("class", "notAllow");
					} else {
						$("#CustomerCorporationInfos_panel").removeClass("notAllow");
						$("#CustomerSalesInfos_panel").removeClass("notAllow");
						$("#CustomerPartnerInfos_panel").removeClass("notAllow");
					}
					if (CustomerHeads.CustomerTypeCode == "qt") {
						$(".qtType").hide();
						$("#qtTypeAppraisalRegionName").html("所在省区");
						$("#qtTypeAppraisalCityName").html("所在城市");
						$(".CustomerSalesInfos_AppraisalZoneName").find("i").hide();
						$("#CustomerSalesInfos_AppraisalZoneName").removeAttr("name");
						//LegalPersonIdCard 非必填
						$(".dtLegalPersonIdCard").find("i").hide();
				        //$("#LegalPersonIdCard").rules("remove");
					} else {
						$(".qtType").show();
						$("#qtTypeAppraisalRegionName").html("考核省区");
						$("#qtTypeAppraisalCityName").html("考核城市");
						$(".CustomerSalesInfos_AppraisalZoneName").find("i").show();
						$("#CustomerSalesInfos_AppraisalZoneName").attr("name", "CustomerSalesInfos_AppraisalZoneName");
						$(".dtLegalPersonIdCard").find("i").show();
				        //$("#LegalPersonIdCard").rules("add",{required:true,minlength:15,messages:{required:"法人身份证号为必填项", minlength : "身份证号最少15位"}});
					}
					$("#head_Msg_Name").html(" - " + CustomerHeads.Name);
					// 老客户修改
					if (page_action == "upd" && action_type == "new") {
						CustomerHeads.HeadsId = CustomerHeads.Id;
   					}
					// 基础信息
					$("#Name").val(CustomerHeads.Name);
					$("#Number").val(CustomerHeads.Number);
					$("#Code").val(CustomerHeads.Code);
					$("#ErpCode").val(CustomerHeads.ErpCode);
					$("#LastOldName").val(CustomerHeads.LastOldName ? CustomerHeads.LastOldName : "");
					$("#CustomerTypeName").val(CustomerHeads.CustomerTypeCode + "-" + CustomerHeads.CustomerTypeName);
					$("#CustomerAccountGroupName").val(CustomerHeads.CustomerAccountGroupId ? (CustomerHeads.CustomerAccountGroupCode + "-" + CustomerHeads.CustomerAccountGroupName) : "");
					$("#ErpPackageCode").val(CustomerHeads.ErpPackageCode);
					$("#AppraisalRegionName").val(CustomerHeads.AppraisalRegionName);
					$("#AppraisalCityName").val(CustomerHeads.AppraisalCityName);
					$("#RegionName").val(CustomerHeads.RegionName);
					$("#LegalPerson").val(CustomerHeads.LegalPerson);
					$("#LegalPersonIdCard").val(CustomerHeads.LegalPersonIdCard);
					$("#Nature").val(CustomerHeads.Nature);
					$("#CompanyKindName").val(CustomerHeads.CompanyKindCode ? (CustomerHeads.CompanyKindCode + "-" + CustomerHeads.CompanyKindName) : "");
					$("#TradeName").val(CustomerHeads.TradeCode ? (CustomerHeads.TradeCode + "-" + CustomerHeads.TradeName) : "");
					$("#Address").val(CustomerHeads.Address);
					$("#Telephone").val(CustomerHeads.Telephone);
					$("#Email").val(CustomerHeads.Email);
					$("#PostalCode").val(CustomerHeads.PostalCode);
					if (page_action == "new" || page_action == "upd") {
						$("#OrganizationName").val(CustomerHeads.OrganizationName);
						$("#Caption").val(CustomerHeads.Caption);
					}
					// 开票信息
					$("#InvoiceTypeName").val(CustomerHeads.InvoiceTypeId ? (CustomerHeads.InvoiceTypeErpCode + "-" + CustomerHeads.InvoiceTypeName) : "");
					$("#InvoiceReceiver").val(CustomerHeads.InvoiceReceiver);
					$("#InvoiceReceiverTele").val(CustomerHeads.InvoiceReceiverTele);
					$("#InvoiceMailAddress").val(CustomerHeads.InvoiceMailAddress);
					$("#TaxId").val(CustomerHeads.TaxId);
					$("#InvoiceTele").val(CustomerHeads.InvoiceTele);
					$("#InvoiceAddress").val(CustomerHeads.InvoiceAddress);
					$("#InvoiceBank").val(CustomerHeads.InvoiceBank);
					$("#InvoiceAccount").val(CustomerHeads.InvoiceAccount);
					$("#InvoiceLocalNumber").val(CustomerHeads.InvoiceLocalNumber);
					if (CustomerHeads.IsNeedTax) {
						$(".NeedTax").show();
						$(".NoNeedTax").hide();
					} else {
						$(".NeedTax").hide();
						$(".NoNeedTax").show();
					}
					// 能力信息
					$("#AnnualSales").val(CustomerHeads.AnnualSales);
					$("#AnnualSpiritSales").val(CustomerHeads.AnnualSpiritSales);
					$("#WorkingFund").val(CustomerHeads.WorkingFund);
					$("#CustomerSaleCapacity").val(CustomerHeads.CustomerSaleCapacity);
					$("#ManageCapacity").val(CustomerHeads.ManageCapacity);
					$("#SalesChannel").val(CustomerHeads.SalesChannel);
					$("#SalesRank").val(CustomerHeads.SalesRank);
					$("#NumberOfEmployee").val(CustomerHeads.NumberOfEmployee);
					$("#NumberOfSalesman").val(CustomerHeads.NumberOfSalesman);
					$("#NumberOfPlaner").val(CustomerHeads.NumberOfPlaner);
					$("#NumberOfManager").val(CustomerHeads.NumberOfManager);
					$("#NumberOfServeman").val(CustomerHeads.NumberOfServeman);
					$("#NumberOfVehicle").val(CustomerHeads.NumberOfVehicle);
					$("#NumberOfChar").val(CustomerHeads.NumberOfChar);
					$("#StoreArea").val(CustomerHeads.StoreArea);
					$("#OfficeArea").val(CustomerHeads.OfficeArea);
					$("#SpecialMoney").val(CustomerHeads.SpecialMoney);
					$("#IsSaleOurProduct").val(CustomerHeads.IsSaleOurProduct ? "是" : "否");
					$("#SaleOurProducts").val(CustomerHeads.SaleOurProducts);
					$("#IsHaveKithOrKin").val(CustomerHeads.IsHaveKithOrKin ? "是" : "否");
					$("#OtherRemark").val(CustomerHeads.OtherRemark);
				}
			} else {
				swalNullFalseMsg("客户抬头信息");
			}
		}, error: function() {
			$(".await").fadeOut(300);
   	  		swalNetErrorMsg("客户抬头信息");
   	  	}
	});
}

// 加载附件 ////#I14YDR   给该函数传一个参数作为区分老客户修改还是新客户开户还是客户管理下的数据请求
function loadFiles(_page_action, _action_type) {
	var json = {};
	json.HeadsId = this_HeadsId;
	json.type = "file";
	json.page_action = _page_action;
	json.action_type = _action_type;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				Files = data.message;
				var htmls = "";
				for (var f = 0; f < Files.length; f++) {
					var fileSuffix = Files[f].SourcePath.substring(Files[f].SourcePath.lastIndexOf("."), Files[f].SourcePath.length);
					htmls += "<div class = 'uploadify-queue-item' id = " + Files[f].Id + ">";
					if (fileSuffix  == '.png' || fileSuffix  == '.jpg' || fileSuffix  == '.gif') {
						htmls += "<span class = 'up_filename'><img target = 'blank' data-magnify = 'gallery' data-src = " + ossBasePath + Files[f].SourcePath + " src = " + ossBasePath + Files[f].SourcePath + ">" + Files[f].SourceName + "</img></span>";
					} else {
						htmls += '<span class = "up_filename"><a target = "blank" href="' + ossBasePath + Files[f].SourcePath+'">' + Files[f].SourceName + '</a></span>';
					}
					if (action_type != "detail" && action_type != "manager_edit") {
						htmls += "<a href = 'javascript:void(0);' class = 'delfilebtn deleteFile'>删除</a>";
					}
					htmls += "</div>";
				}
				if (action_type == "manager_edit") {
					$("#upload_headsFile").append(htmls == "" ? "未添加文件" : htmls);
				} else if (action_type != "detail") {
					$("#heads_file_upd").find(".uploadify-queue").append(htmls);
				} else {
					$("#upload_headsFile").append(htmls == "" ? "未添加文件" : htmls);
				}
			} else {
				swalNullFalseMsg("附件信息");
			}
		}, error: function() {
	  		swalNetErrorMsg("附件");
	  	}
	});
}

// 一次性客户只需加载组织机构表格
function loadOneTable(tableWidth, tableHeight) {
	// 管理机构
	$("#one_CustomerOrganizations_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "组织机构名称", "组织机构代码","组织机构路径","是否冻结"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key:true},
			{ name: "OrganizationName", index: "OrganizationName", width: tableWidth/4},
			{ name: "OrganizationCode", index: "OrganizationCode", width: tableWidth/4},
			{ name: "OrganizationPath", index: "OrganizationPath", width: tableWidth/4},
			{ name: "IsFreezed", index: "IsFreezed", width: tableWidth/4, formatter: "checkbox"}],
		pager: "#one_CustomerOrganizations_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});
}
// 加载表格
function loadTables(tableWidth, tableHeight) {
	// 业务联系人表格
	$("#CustomerLinkmans_table").jqGrid({
    	data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
        rowList: [30, 50, 100],
        colNames: ["Id", "联系人类型", "姓名","性别","身份证号","联系电话","电子邮箱"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key: true},
	        { name: "LinkmanTypeName", index: "LinkmanTypeName", width: tableWidth/6},
	        { name: "Name", index: "Name", width: tableWidth/6},
	        { name: "Gender", index: "Gender", width: tableWidth/6, formatter: function(cellvalue) {return cellvalue == 1 ? "男" : "女"}},
	        { name: "IdCard", index: "IdCard", width: tableWidth/6},
	        { name: "Mobile", index: "Mobile", width: tableWidth/6},
	        { name: "Email", index: "Email", width: tableWidth/6 - 50}],
		pager: "#CustomerLinkmans_table_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
    });

	// 送货信息表格
	$("#CustomerDeliveryAddrs_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "送货地址类型", "是否默认地址","行政区域","街道地址","联系人","联系电话"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true,  key: true},
			{ name: "DeliveryAddressTypeName", index: "DeliveryAddressTypeName", width: tableWidth/6},
			{ name: "IsStandard", index: "IsStandard", width: tableWidth/6, formatter: "checkbox"},
			{ name: "RegionPath", index: "RegionPath", width: tableWidth/6},
			{ name: "Address", index: "Address", width: tableWidth/6},
			{ name: "Linkman", index: "Linkman", width: tableWidth/6},
			{ name: "Mobile", index: "Mobile", width: tableWidth/6}],
			pager: "#CustomerDeliveryAddrs_table_pager",
			viewrecords: true,
			hidegrid: false,
			footerrow: false,
			rownumbers: true
	});

	// 渠道运营现状分析
	$("#CustomerDistributes_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: 120,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "销售渠道类型", "销售渠道数量","销量比%","覆盖率%","排名"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key : true},
			{ name: "DistributeTypeName", index: "DistributeTypeName", width: tableWidth/5},
			{ name: "Amount", index: "Amount", width: tableWidth/5},
			{ name: "SalesRate", index: "SalesRate", width: tableWidth/5},
			{ name: "CoverageRate", index: "CoverageRate", width: tableWidth/5},
			{ name: "Ranking", index: "Ranking", width: tableWidth/5}],
		pager: "#CustomerDistributes_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 品牌运营现状
	$("#CustomerMarketings_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: 120,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "品牌", "供价","年销售额（万元）","毛利率%","销售渠道","增长潜力","厂家关系","与厂家合同期","合作起始年"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key : true},
			{ name: "Brand", index: "Brand", width: tableWidth/9},
			{ name: "Price", index: "Price", width: tableWidth/9},
			{ name: "AnnualSales", index: "AnnualSales", width: tableWidth/9},
			{ name: "MarginRate", index: "MarginRate", width: tableWidth/9},
			{ name: "DistributeTypeName", index: "DistributeTypeName", width: tableWidth/9},
			{ name: "GrowthPotential", index: "GrowthPotential", width: tableWidth/9},
			{ name: "FactoryRelation", index: "FactoryRelation", width: tableWidth/9},
			{ name: "ContractYear", index: "ContractYear", width: tableWidth/9},
			{ name: "BeginYear", index: "BeginYear", width: tableWidth/9}],
		pager: "#CustomerMarketings_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 和公司现有关系
	$("#CustomerKithOrKins_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: 120,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "名称", "关系"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key : true},
			{ name: "Name", index: "Name", width: tableWidth/2},
			{ name: "Relation", index: "Relation", width: tableWidth/2}],
		pager: "#CustomerKithOrKins_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 企业决策人信息
	$("#CustomerPolicymakers_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: 120,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "姓名", "爱好","从业年限","当地主要社会关系","经营理念","性格分析"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key : true},
			{ name: "Name", index: "Name", width: tableWidth/6},
			{ name: "Favorite", index: "Favorite", width: tableWidth/6},
			{ name: "WorkYears", index: "WorkYears", width: tableWidth/6},
			{ name: "SocietyRelation", index: "SocietyRelation", width: tableWidth/6},
			{ name: "OperationPrinciple", index: "OperationPrinciple", width: tableWidth/6},
			{ name: "CharacterAnalysis", index: "CharacterAnalysis", width: tableWidth/6}],
			pager: "#CustomerPolicymakers_table_pager",
			viewrecords: true,
			hidegrid: false,
			footerrow: false,
			rownumbers: true
	});

	// 开户预期销售信息
	$("#CustomerExpectedSales_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "期望交易公司", "经销区域","经销开始时间","经销截止时间","其他信息","经销产品","年销售目标","价格（元/瓶）","首单回款（万元）"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key : true},
			{ name: "CorporationName", index: "CorporationName", width: tableWidth/9},
			{ name: "SalesRegionName", index: "SalesRegionName", width: tableWidth/9},
			{ name: "SalesStartDate", index: "SalesStartDate", width: tableWidth/9, formatter : function(value) {
				 return value ? getDate(new Date(value)) : '';
			 }},
			{ name: "SalesEndDate", index: "SalesEndDate", width: tableWidth/9, formatter : function(value) {
				 return value ? getDate(new Date(value)) : '';
			 }},
			{ name: "SalesRemark", index: "SalesRemark", width: tableWidth/9},
			{ name: "ProductRemark", index: "ProductRemark", width: tableWidth/9},
			{ name: "SalesTarget", index: "SalesTarget", width: tableWidth/9},
			{ name: "PriceLevel", index: "PriceLevel", width: tableWidth/9},
			{ name: "FirstBackMoney", index: "FirstBackMoney", width: tableWidth/9}],
		pager: "#CustomerExpectedSales_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 管理机构
	$("#CustomerOrganizations_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "组织机构名称", "组织机构代码","组织机构路径","是否冻结"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key:true},
			{ name: "OrganizationName", index: "OrganizationName", width: tableWidth/4},
			{ name: "OrganizationCode", index: "OrganizationCode", width: tableWidth/4},
			{ name: "OrganizationPath", index: "OrganizationPath", width: tableWidth/4},
			{ name: "IsFreezed", index: "IsFreezed", width: tableWidth/4 - 50, formatter: "checkbox"}],
		pager: "#CustomerOrganizations_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 公司信息
	$("#CustomerCorporationInfos_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "公司名称", "公司编号","统驭科目","支付条款","开票类型","发票收件人","发票收件人手机号","是否冻结"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key:true},
			{ name: "CorporationName", index: "CorporationName", width: tableWidth/8},
			{ name: "CorporationId", index: "CorporationId", width: tableWidth/8},
			{ name: "LedgerAccountName", index: "LedgerAccountName", width: tableWidth/8},
			{ name: "PaymentTermName", index: "PaymentTermName", width: tableWidth/8},
			{ name: "InvoiceTypeName", index: "InvoiceTypeName", width: tableWidth/8},
			{ name: "InvoiceReceiver", index: "InvoiceReceiver", width: tableWidth/8},
			{ name: "InvoiceReceiverTele", index: "InvoiceReceiverTele", width: tableWidth/8},
			{ name: "IsFreezed", index: "IsFreezed", width: tableWidth/8 - 50, formatter: "checkbox"}],
		pager: "#CustomerCorporationInfos_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 销售信息
	$("#CustomerSalesInfos_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "支付条款", "销售范围","工厂名称","账户分配组","客户组","销售区域","销售办公室","考核片区", "考核片区全路径", "是否冻结"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key:true},
			{ name: "PaymentTermName", index: "PaymentTermName", width: tableWidth/10},
			{ name: "SalesDistributeRangeName", index: "SalesDistributeRangeName", width: tableWidth/10},
			{ name: "FactoryName", index: "FactoryName", width: tableWidth/10},
			{ name: "AccountAssignGroupName", index: "AccountAssignGroupName", width: tableWidth/10},
			{ name: "CustomerGroupName", index: "CustomerGroupName", width: tableWidth/10},
			{ name: "SalesAreaName", index: "SalesAreaName", width: tableWidth/10},
			{ name: "SalesOfficeName", index: "SalesOfficeName", width: tableWidth/10},
			{ name: "AppraisalZoneName", index: "AppraisalZoneName", width: tableWidth/10},
			{ name: "AppraisalZoneNames", index: "AppraisalZoneNames", width: tableWidth/10},
			{ name: "IsFreezed", index: "IsFreezed", width: tableWidth/10 - 50, formatter: "checkbox"}
		],
		pager: "#CustomerSalesInfos_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	// 合作伙伴信息
	$("#CustomerPartnerInfos_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		width: tableWidth,
		height: tableHeight,
		rowNum: 10,
		rowList: [30, 50, 100],
		colNames: ["Id", "销售范围", "合作伙伴功能","合作伙伴ERP代码","合作伙伴名称","是否冻结"],
		colModel: [
			{ name: "Id", index: "Id", hidden: true, key:true},
			{ name: "SalesDistributeRangeName", index: "SalesDistributeRangeName", width: tableWidth/5},
			{ name: "PartnerFunctionName", index: "PartnerFunctionName", width: tableWidth/5},
			{ name: "PartnerErpCode", index: "PartnerErpCode", width: tableWidth/5},
			{ name: "PartnerName", index: "PartnerName", width: tableWidth/5},
			{ name: "IsFreezed", index: "IsFreezed", width: tableWidth/5 - 50, formatter:"checkbox"}],
		pager: "#CustomerPartnerInfos_table_pager",
		viewrecords: true,
		hidegrid: false,
		footerrow: false,
		rownumbers: true
	});

	if (!(page_action == "new" && (action_type == "new" || action_type == "upd"))) {
//		$("#CustomerLinkmans_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
//		$("#CustomerDeliveryAddrs_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
		$("#CustomerOrganizations_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
		$("#CustomerCorporationInfos_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
		$("#CustomerSalesInfos_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
		$("#CustomerPartnerInfos_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
	}

	// 销售范围
	$("#SalesDistributeRanges_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		height: 180,
		rowNum: 10,
		rowList: [10, 20, 30],
		colNames: ["SalesOrganizationId", "公司代码", "公司名称"],
		colModel: [
			{ name: "SalesOrganizationId", index: "SalesOrganizationId", hidden : true},
			{ name: "Id", index: "Id", align: "left", width: 150, searchoptions:{sopt:['cn']}, key : true},
			{ name: "Name", index: "Name", align: "left", width: 260, searchoptions:{sopt:['cn']}}
			],
			pager: "#SalesDistributeRanges_table_pager",
			viewrecords: true,
			hidegrid: false,
			onSelectRow: function(rowid) {
				if (this_object.SalesDistributeRangeId == rowid) {
					$("#input_jqgrid_SalesDistributeRanges").hide();
					return;
				}

				// 检查权限
				var SalesOrganizationId = $("#SalesDistributeRanges_table").getCell(rowid, "SalesOrganizationId");
				if (User_corporations != "admin" && User_corporations.indexOf(SalesOrganizationId) == -1) {
			    	swalMsg("", "您没有该公司的操作权限，无法添加", "error");
			    	return;
			    }

				if (clickWay == "CustomerSalesInfosClick") {
					for (var i in CustomerSalesInfos) {
						if (CustomerSalesInfos[i].SalesOrganizationId == SalesOrganizationId && CustomerSalesInfos[i].SalesDistributeRangeId == rowid) {
						//if (CustomerSalesInfos[i].SalesOrganizationId == SalesOrganizationId && CustomerSalesInfos[i].Id != this_object.Id) {
							swalMsg("", "相同公司只能添加一条销售信息", "warning");
							return;
						}
					}
					$("#CustomerSalesInfos_SalesDistributeRangeName").val(rowid + "-" + $("#SalesDistributeRanges_table").getCell(rowid, "Name"));
					this_object.SalesDistributeRangeId = rowid;
					this_object.SalesDistributeRangeName = $("#SalesDistributeRanges_table").getCell(rowid, "Name");
					getCustomerSalesInfosSalesOffices("add");
					this_object.SalesOfficeId = null;
					this_object.SalesOfficeName = null;
					$("#CustomerSalesInfos_SalesOfficeName").val("");
					// 组织机构改变重新获取工厂和销售办公室
					if (!this_object.SalesOrganizationId || this_object.SalesOrganizationId != $("#SalesDistributeRanges_table").getCell(rowid, "SalesOrganizationId")) {
						this_object.SalesOrganizationId = SalesOrganizationId;
						$("#CustomerSalesInfos_FactoryName").val("");
						this_object.FactoryId = null;
						this_object.FactoryName = null;
						getCustomerSalesInfosFactories("add");
						AppraisalZones = null;
					}
				} else if (clickWay == "CustomerPartnerInfosClick") {
					$("#CustomerPartnerInfos_SalesDistributeRangeName").val(rowid + "-" + $("#SalesDistributeRanges_table").getCell(rowid, "Name"));
					this_object.SalesDistributeRangeId = rowid;
					this_object.SalesDistributeRangeName = $("#SalesDistributeRanges_table").getCell(rowid, "Name");
					Partners = null;
				}
				$("#input_jqgrid_SalesDistributeRanges").hide();
			}
	});
	$("#SalesDistributeRanges_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});

	// 合作伙伴
	$("#Partners_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		height: 180,
		rowNum: 10,
		rowList: [10, 20, 30],
		colNames: ["Id", "代码", "Erp代码", "名称"],
		colModel: [
			{ name: "Id", index: "Id", hidden : true, key:true},
			{ name: "Code", index: "Code", align: "left", width: 80, searchoptions:{sopt:['cn']}},
			{ name: "ErpCode", index: "ErpCode", align: "left", width: 100, searchoptions:{sopt:['cn']}},
			{ name: "Name", index: "Name", align: "left", width: 230, searchoptions:{sopt:['cn']}}
			],
		pager: "#Partners_table_pager",
		viewrecords: true,
		hidegrid: false,
		onSelectRow: function(rowid) {
			if (this_object.PartnerId == rowid) {
				return;
			}
			this_object.PartnerId = rowid;
			this_object.PartnerCode = $("#Partners_table").getCell(rowid, "Code");
			this_object.PartnerErpCode = $("#Partners_table").getCell(rowid, "ErpCode");
			this_object.PartnerName = $("#Partners_table").getCell(rowid, "Name");
			$("#CustomerPartnerInfos_PartnerName").val($("#Partners_table").getCell(rowid, "Code") + "-" + $("#Partners_table").getCell(rowid, "Name"));
			$("#CustomerPartnerInfos_PartnerErpCode").val($("#Partners_table").getCell(rowid, "ErpCode"));
			$("#input_jqgrid_Partners").hide();
		}
	});
	$("#Partners_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});

	$("#SalesOffices_table").jqGrid({
		data: [],
		datatype: "local",
		shrinkToFit: false,
		height: 180,
		rowNum: 10,
		rowList: [10, 20, 30],
		colNames: ["代码", "名称"],
		colModel: [
			{ name: "Id", index: "Id", align: "left", width: 150, searchoptions:{sopt:['cn']}, key : true},
			{ name: "Name", index: "Name", align: "left", width: 260, searchoptions:{sopt:['cn']}}
			],
		pager: "#SalesOffices_table_pager",
		viewrecords: true,
		hidegrid: false,
		onSelectRow: function(rowid) {
			if (clickWay == "CustomerSalesInfosClick") {
				if (this_object.SalesOfficeId != rowid) {
					this_object.SalesOfficeId = rowid;
					this_object.SalesOfficeName = $("#SalesOffices_table").getCell(rowid, "Name");
					$("#CustomerSalesInfos_SalesOfficeName").val(rowid + "-" + $("#SalesOffices_table").getCell(rowid, "Name"));
				}
			}
			$("#input_jqgrid_SalesOffices").hide();
		}
	});
	$("#SalesOffices_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});

}

// 加载业务联系人
function loadCustomerLinkmans() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestlinkmans";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerlinkmans";
		} else {
			json.tableName = "cus_customerrequestlinkmans";
		}
	} else {
		json.tableName = "cus_customerlinkmans";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerLinkmans = data.message;
				$("#CustomerLinkmans_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerLinkmans,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("业务联系人信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
   	  		swalNetErrorMsg("业务联系人信息");
   	  	}
	});
}

// 加载送货信息
function loadCustomerDeliveryAddrs() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestdeliveryaddrs";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerdeliveryaddrs";
		} else {
			json.tableName = "cus_customerrequestdeliveryaddrs";
		}
	} else {
		json.tableName = "cus_customerdeliveryaddrs";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerDeliveryAddrs = data.message;
				$("#CustomerDeliveryAddrs_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerDeliveryAddrs,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("送货信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("送货信息");
		}
	});
}

// 能力信息
function loadCustomerAbilities() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestdistributes,cus_customerrequestmarketings,cus_customerrequestkithorkins,cus_customerrequestpolicymakers";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerdistributes,cus_customermarketings,cus_customerkithorkins,cus_customerpolicymakers";
		} else {
			json.tableName = "cus_customerrequestdistributes,cus_customerrequestmarketings,cus_customerrequestkithorkins,cus_customerrequestpolicymakers";
		}
	} else {
		json.tableName = "cus_customerdistributes,cus_customermarketings,cus_customerkithorkins,cus_customerpolicymakers";
	}
	json.HeadsId = this_HeadsId;
	json.Type = "abilities";
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				ifGetAbilities = true;
				data = data.message;
				if (page_action == "new" || (page_action == "upd" && action_type != "new")) {
					CustomerDistributes = data.cus_customerrequestdistributes;
					CustomerMarketings = data.cus_customerrequestmarketings;
					CustomerKithOrKins = data.cus_customerrequestkithorkins;
					CustomerPolicymakers = data.cus_customerrequestpolicymakers;
				} else {
					CustomerDistributes = data.cus_customerdistributes;
					CustomerMarketings = data.cus_customermarketings;
					CustomerKithOrKins = data.cus_customerkithorkins;
					CustomerPolicymakers = data.cus_customerpolicymakers;
				}
				// 渠道运营现状
				$("#CustomerDistributes_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerDistributes,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
				// 品牌运营现状
				$("#CustomerMarketings_table").jqGrid('setGridParam', {
					datatype: 'local',
					data: CustomerMarketings,
					page: 1
				}).trigger("reloadGrid");
				// 和公司现有关系
				$("#CustomerKithOrKins_table").jqGrid('setGridParam', {
					datatype: 'local',
					data: CustomerKithOrKins,
					page: 1
				}).trigger("reloadGrid");
				// 企业决策人信息
				$("#CustomerPolicymakers_table").jqGrid('setGridParam', {
					datatype: 'local',
					data: CustomerPolicymakers,
					page: 1
				}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("能力信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("能力信息");
		}
	});
}

// 开户预期销售信息
function loadCustomerExpectedSales() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestexpectedsales";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerexpectedsales";
		} else {
			json.tableName = "cus_customerrequestexpectedsales";
		}
	} else {
		json.tableName = "cus_customerexpectedsales";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerExpectedSales = data.message;
				$("#CustomerExpectedSales_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerExpectedSales,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("开户预期信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("开户预期信息");
		}
	});
}

// 管理机构
function loadCustomerOrganizations() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestorganizations";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerorganizations";
		} else {
			json.tableName = "cus_customerrequestorganizations";
		}
	} else {
		json.tableName = "cus_customerorganizations";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerOrganizations = data.message;
				if (page_action == "one") {
					$("#one_CustomerOrganizations_table").jqGrid('setGridParam', {
						datatype: 'local',
						data: CustomerOrganizations,
						page: 1
					}).trigger("reloadGrid");
				} else {
					$("#CustomerOrganizations_table").jqGrid('setGridParam', {
						datatype: 'local',
						data: CustomerOrganizations,
						page: 1
					}).trigger("reloadGrid");
				}
			} else {
				swalNullFalseMsg("客户管理机构信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("客户管理机构信息");
		}
	});
}

// 公司信息
function loadCustomerCorporationInfos() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestcorporationinfos";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customercorporationinfos";
		} else {
			json.tableName = "cus_customerrequestcorporationinfos";
		}
	} else {
		json.tableName = "cus_customercorporationinfos";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerCorporationInfos = data.message;
				$("#CustomerCorporationInfos_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerCorporationInfos,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("客户公司信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("客户公司信息");
		}
	});
}

// 销售信息
function loadCustomerSalesInfos() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestsalesinfos";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customersalesinfos";
		} else {
			json.tableName = "cus_customerrequestsalesinfos";
		}
	} else {
		json.tableName = "cus_customersalesinfos";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerSalesInfos = data.message;
				$("#CustomerSalesInfos_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerSalesInfos,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("客户销售信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("客户销售信息");
		}
	});
}

// 合作伙伴信息
function loadCustomerPartnerInfos() {
//	$(".await").fadeIn(300);
	var json = {};
	if (page_action == "new") {
		json.tableName = "cus_customerrequestpartnerinfos";
	} else if (page_action == "upd") {
		if (action_type == "new") {
			json.tableName = "cus_customerpartnerinfos";
		} else {
			json.tableName = "cus_customerrequestpartnerinfos";
		}
	} else {
		json.tableName = "cus_customerpartnerinfos";
	}
	json.HeadsId = this_HeadsId;
	$.ajax({
		type: "post",
		url: "../customers/customerDetail.json",
		data: {JsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
//			$(".await").fadeOut(100);
			if (data.success === true) {
				CustomerPartnerInfos = data.message;
				$("#CustomerPartnerInfos_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerPartnerInfos,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
			} else {
				swalNullFalseMsg("客户合作伙伴信息");
			}
		}, error: function() {
//			$(".await").fadeOut(100);
			swalNetErrorMsg("客户合作伙伴信息");
		}
	});
}

// 客户类型
var CustomerTypes = null;
function getCustomerTypes(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getCustomerTypes.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				CustomerTypes = data.message;
				if (CustomerTypes.length === 0) {
					CustomerTypes = null;
					if (way == "click") {
						swalEmptyMsg("客户类型");
					}
					return;
				}
				// 新增默认加载
				if (page_action == "new" && way == "addLoad") {
					$("#CustomerTypeName").val(CustomerTypes[0].Code + "-" + CustomerTypes[0].Name);
					CustomerHeads.CustomerTypeId = CustomerTypes[0].Id;
					CustomerHeads.IsOneTime = CustomerTypes[0].IsOnce;
					CustomerHeads.CanSendToERP = CustomerTypes[0].CanSendToERP;
					CustomerHeads.CustomerTypeCode = CustomerTypes[0].Code;
					CustomerHeads.CustomerTypeName = CustomerTypes[0].Name;
				}
				// 一次性客户新增加载
				if (page_action == "one") {
					for (var i = CustomerTypes.length - 1; i >= 0; i--) {
						if (CustomerTypes[i].IsOnce == 0) {
							CustomerTypes.splice(i, 1);
						}
					}
					if (way == "addLoad") {
						$("#one_CustomerTypeName").val(CustomerTypes[0].Code + "-" + CustomerTypes[0].Name);
						CustomerHeads.CustomerTypeId = CustomerTypes[0].Id;
						CustomerHeads.IsOneTime = CustomerTypes[0].IsOnce;
						CustomerHeads.CanSendToERP = CustomerTypes[0].CanSendToERP;
						CustomerHeads.CustomerTypeCode = CustomerTypes[0].Code;
						CustomerHeads.CustomerTypeName = CustomerTypes[0].Name;
					}
				}
				var htmls = "";
				for (i = 0; i < CustomerTypes.length; i++) {
                    //20190731	cc	#IZRVK
                    //如果是一次性客户则不能修改为非一次性客户
                    if( true == CustomerHeads.IsOneTime )
                    {
                        if( true == CustomerTypes[i].IsOnce)
                        {
                            htmls += "<li CustomerTypeId = " + CustomerTypes[i].Id + ">" + CustomerTypes[i].Code + "-" + CustomerTypes[i].Name + "</li>";
                        }
                    }
                    else
                    {
                        htmls += "<li CustomerTypeId = " + CustomerTypes[i].Id + ">" + CustomerTypes[i].Code + "-" + CustomerTypes[i].Name + "</li>";
                    }
				}
				if (page_action == "one") {
					setDropSel($("#one_CustomerTypeName"), htmls);
				} else {
					setDropSel($("#CustomerTypeName"), htmls);
				}
				if (way == "click") {
					if (page_action == "one") {
						selOnlyShow($("#one_CustomerTypeName"));
					} else {
						selOnlyShow($("#CustomerTypeName"));
					}
				}
			} else {
				swalNullFalseMsg("客户类型");
			}
		}, error: function() {
			swalNetErrorMsg("客户类型");
		}
	});
}

// 客户账户组
var CustomerAccountGroups = null;
function getCustomerAccountGroups(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getCustomerAccountGroups.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				CustomerAccountGroups = data.message;
				if (CustomerAccountGroups.length === 0) {
					CustomerAccountGroups = null;
					if (way == "click") {
						swalEmptyMsg("客户账户组");
					}
					return;
				}
				// 新增订单默认加载
				if (way == "addLoad") {
					$("#CustomerAccountGroupName").val(CustomerAccountGroups[0].Code + "-" + CustomerAccountGroups[0].Name);
					CustomerHeads.CustomerAccountGroupId = CustomerAccountGroups[0].Id;
					CustomerHeads.CustomerAccountGroupCode = CustomerAccountGroups[0].Code;
					CustomerHeads.LedgerAccounts = CustomerAccountGroups[0].LedgerAccounts;
					CustomerHeads.CustomerAccountGroupName = CustomerAccountGroups[0].Name;
				}
				var htmls = "";
				for (i = 0; i < CustomerAccountGroups.length; i++) {
					htmls += "<li CustomerAccountGroupId = " + CustomerAccountGroups[i].Id + ">" + CustomerAccountGroups[i].Code + "-" + CustomerAccountGroups[i].Name + "</li>";
				}
				setDropSel($("#CustomerAccountGroupName"), htmls);
				if (way == "click") {
					selOnlyShow($("#CustomerAccountGroupName"));
				}
			} else {
				swalNullFalseMsg("客户账户组");
			}
		}, error: function() {
			swalNetErrorMsg("客户账户组");
		}
	});
}

// 考核省区
var AppraisalRegions = null;
function getAppraisalRegions(way) {
	$.ajax({
		type: "post",
		url: "../share/getAppraisalRegion.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				AppraisalRegions = data.message;
				if (AppraisalRegions.length === 0) {
					AppraisalRegions = null;
					if (way == "click") {
						swalEmptyMsg("考核省区");
					}
					return;
				}
				var htmls = "";
				for (i = 0; i < AppraisalRegions.length; i++) {
					htmls += "<li ChineseStandard = "+ AppraisalRegions[i].ChineseStandard +" AppraisalRegionId = " + AppraisalRegions[i].Id + ">" + AppraisalRegions[i].ErpCode + "-" + AppraisalRegions[i].Name + "</li>";
				}
				setDropSel($("#AppraisalRegionName"), htmls);
				if (way == "click") {
					selOnlyShow($("#AppraisalRegionName"));
				}
			} else {
				swalNullFalseMsg("考核省区");
			}
		}, error: function() {
			swalNetErrorMsg("考核省区");
		}
	});
}

// 考核城市
var AppraisalCities = null;
function getAppraisalCities(way) {
	if (!CustomerHeads.AppraisalRegionErpCode) {
		swalMsg("", "请先选择考核省区！", "warning");
		return;
	}
	$.ajax({
		type: "get",
		url: "../share/getAppraisalCity/" + CustomerHeads.AppraisalRegionErpCode + ".json",
		data: {},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				AppraisalCities = data.message;
				if (AppraisalCities.length === 0) {
					AppraisalCities = null;
					if (way == "click") {
						swalEmptyMsg("考核城市");
					}
					return;
				}
				var htmls = "";
				for (i = 0; i < AppraisalCities.length; i++) {
					htmls += "<li ChineseStandard = "+ AppraisalCities[i].ChineseStandard +" AppraisalCityErpCode = " + AppraisalCities[i].Id + ">" + AppraisalCities[i].Id + "-" + AppraisalCities[i].Name + "</li>";
				}
				setDropSel($("#AppraisalCityName"), htmls);
				if (way == "click") {
					selOnlyShow($("#AppraisalCityName"));
				}
			} else {
				swalNullFalseMsg("考核城市信息");
			}
		}, error: function() {
			swalNetErrorMsg("考核城市信息");
		}
	});
}

// 企业性质
var CompanyKinds = null;
function getCompanyKinds(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getCompanyKind.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				CompanyKinds = data.message;
				if (CompanyKinds.length === 0) {
					CompanyKinds = null;
					if (way == "click") {
						swalEmptyMsg("企业性质");
					}
					return;
				}
				// 新增订单默认加载
				if (way == "addLoad") {
					$("#CompanyKindName").val(CompanyKinds[0].Code + "-" + CompanyKinds[0].Name);
					CustomerHeads.CompanyKindId = CompanyKinds[0].Id;
					CustomerHeads.CompanyKindCode = CompanyKinds[0].Code;
					CustomerHeads.CompanyKindName = CompanyKinds[0].Name;
				}
				var htmls = "";
				for (i = 0; i < CompanyKinds.length; i++) {
					htmls += "<li CompanyKindId = " + CompanyKinds[i].Id + ">" + CompanyKinds[i].Code + "-" + CompanyKinds[i].Name + "</li>";
				}
				setDropSel($("#CompanyKindName"), htmls);
				if (way == "click") {
					selOnlyShow($("#CompanyKindName"));
				}
			} else {
				swalNullFalseMsg("企业性质信息");
			}
		}, error: function() {
			swalNetErrorMsg("企业性质信息");
		}
	});
}

// 所属行业
var Trades = null;
function getTrades(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getTrade.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				Trades = data.message;
				if (Trades.length === 0) {
					Trades = null;
					if (way == "click") {
						swalEmptyMsg("所属行业");
					}
					return;
				}
				// 新增订单默认加载
				if (way == "addLoad") {
					$("#TradeName").val(Trades[0].Code + "-" + Trades[0].Name);
					CustomerHeads.TradeId = Trades[0].Id;
					CustomerHeads.TradeCode = Trades[0].Code;
					CustomerHeads.TradeName = Trades[0].Name;
				}
				var htmls = "";
				for (i = 0; i < Trades.length; i++) {
					htmls += "<li TradeId = " + Trades[i].Id + ">" + Trades[i].Code + "-" + Trades[i].Name + "</li>";
				}
				setDropSel($("#TradeName"), htmls);
				if (way == "click") {
					selOnlyShow($("#TradeName"));
				}
			} else {
				swalNullFalseMsg("所属行业");
			}
		}, error: function() {
			swalNetErrorMsg("所属行业");
		}
	});
}

// 开票类型
var InvoiceTypes = null;
function getInvoiceTypes(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getInvoiceType.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				InvoiceTypes = data.message;
				if (InvoiceTypes.length === 0) {
					InvoiceTypes = null;
					if (way == "click") {
						swalEmptyMsg("开票类型");
					}
					return;
				}
				// 新增订单默认加载
				if (way == "addLoad") {
					$("#InvoiceTypeName").val(InvoiceTypes[0].Code + "-" + InvoiceTypes[0].Name);
					CustomerHeads.InvoiceTypeId = InvoiceTypes[0].Id;
					CustomerHeads.InvoiceTypeCode = InvoiceTypes[0].Code;
					CustomerHeads.InvoiceTypeErpCode = InvoiceTypes[0].ErpCode;
					CustomerHeads.IsNeedTax = InvoiceTypes[0].IsNeedTax;
					CustomerHeads.InvoiceTypeName = InvoiceTypes[0].Name;
					if (CustomerHeads.IsNeedTax) {
						$(".NeedTax").show();
						$(".NoNeedTax").hide();
					} else {
						$(".NeedTax").hide();
						$(".NoNeedTax").show();
					}
				}
				if (clickWay == "CustomerCorporationInfosClick") {
					this_object.InvoiceTypeId = InvoiceTypes[0].Id;
					this_object.InvoiceTypeCode = InvoiceTypes[0].Code;
					this_object.InvoiceTypeErpCode = InvoiceTypes[0].ErpCode;
					this_object.InvoiceTypeName = InvoiceTypes[0].Name;
					$("#CustomerCorporationInfos_InvoiceTypeName").val(InvoiceTypes[0].ErpCode + "-" + InvoiceTypes[0].Name);
				}
				var htmls = "";
				if (way == "oneAddLoad") {
					htmls += "<li></li>";
				}
				for (i = 0; i < InvoiceTypes.length; i++) {
					htmls += "<li InvoiceTypeId = " + InvoiceTypes[i].Id + ">" + InvoiceTypes[i].ErpCode + "-" + InvoiceTypes[i].Name + "</li>";
				}
				setDropSel($("#InvoiceTypeName"), htmls);
				setDropSel($("#CustomerCorporationInfos_InvoiceTypeName"), htmls);
				if (way == "CustomerHeadsclick") {
					selOnlyShow($("#InvoiceTypeName"));
				}
				if (way == "CustomerCorporationInfosClick") {
					selOnlyShow($("#CustomerCorporationInfos_InvoiceTypeName"));
				}
			} else {
				swalNullFalseMsg("开票类型");
			}
		}, error: function() {
			swalNetErrorMsg("开票类型");
		}
	});
}

// 联系人类型
var LinkmanTypes = null;
function getLinkmanTypes(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getLinkmanType.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				LinkmanTypes = data.message;
				if (LinkmanTypes.length === 0) {
					LinkmanTypes = null;
					if (way == "click") {
						swalEmptyMsg("联系人类型");
					}
					return;
				}
				if (way == "add") {
					$("#CustomerLinkman_LinkmanTypeName").val(LinkmanTypes[0].Code + "-" + LinkmanTypes[0].Name);
					this_object.LinkmanTypeId = LinkmanTypes[0].Id;
					this_object.LinkmanTypeCode = LinkmanTypes[0].Code;
					this_object.LinkmanTypeName = LinkmanTypes[0].Name;
				}
				var htmls = "";
				for (i = 0; i < LinkmanTypes.length; i++) {
					htmls += "<li LinkmanTypeId = " + LinkmanTypes[i].Id + ">" + LinkmanTypes[i].Code + "-" + LinkmanTypes[i].Name + "</li>";
				}
				setDropSel($("#CustomerLinkman_LinkmanTypeName"), htmls);
				if (way == "click") {
					selOnlyShow($("#CustomerLinkman_LinkmanTypeName"));
				}
			} else {
				swalNullFalseMsg("联系人类型");
			}
		}, error: function() {
			swalNetErrorMsg("联系人类型");
		}
	});
}

// 送货地址类型
var DeliveryAddressTypes = null;
function getDeliveryAddressTypes(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getDeliveryAddressType.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				DeliveryAddressTypes = data.message;
				if (DeliveryAddressTypes.length === 0) {
					DeliveryAddressTypes = null;
					if (way == "click") {
						swalEmptyMsg("送货地址类型");
					}
					return;
				}
				if (way == "add") {
					$("#CustomerDeliveryAddrs_DeliveryAddressTypeName").val(DeliveryAddressTypes[0].Code + "-" + DeliveryAddressTypes[0].Name);
					this_object.DeliveryAddressTypeId = DeliveryAddressTypes[0].Id;
					this_object.DeliveryAddressTypeCode = DeliveryAddressTypes[0].Code;
					this_object.DeliveryAddressTypeName = DeliveryAddressTypes[0].Name;
				}
				var htmls = "";
				for (i = 0; i < DeliveryAddressTypes.length; i++) {
					htmls += "<li DeliveryAddressTypeId = " + DeliveryAddressTypes[i].Id + ">" + DeliveryAddressTypes[i].Code + "-" + DeliveryAddressTypes[i].Name + "</li>";
				}
				setDropSel($("#CustomerDeliveryAddrs_DeliveryAddressTypeName"), htmls);
				if (way == "click") {
					selOnlyShow($("#CustomerDeliveryAddrs_DeliveryAddressTypeName"));
				}
			} else {
				swalNullFalseMsg("送货地址类型");
			}
		}, error: function() {
			swalNetErrorMsg("送货地址类型");
		}
	});
}

// 所有公司
var Corporations = null;
function getCorporations(way) {
	$.ajax({
		type: "post",
		url: "../share/getCorporationName.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				Corporations = data.message;
				if (Corporations.length === 0) {
					Corporations = null;
					if (way != "") {
						swalEmptyMsg("公司");
					}
					return;
				}
				$("#Corporations_table").jqGrid({
					data: Corporations,
					datatype: "local",
					shrinkToFit: false,
					height: 180,
					rowNum: 10,
					rowList: [10, 20, 30],
					colNames: ["公司代码", "公司名称"],
					colModel: [
						{ name: "Id", index: "Id", align: "left", width: 150, searchoptions:{sopt:['cn']}, key : true},
						{ name: "Name", index: "Name", align: "left", width: 260, searchoptions:{sopt:['cn']}}
					],
					pager: "#Corporations_table_pager",
					viewrecords: true,
					hidegrid: false,
					onSelectRow: function(rowid) {
						if (clickWay == "CustomerExpectedSalesclick") {
							$("#CustomerExpectedSales_CorporationName").val(rowid + "-" + $("#Corporations_table").getCell(rowid, "Name"));
							this_object.CorporationId = rowid;
							this_object.CorporationName = $("#Corporations_table").getCell(rowid, "Name");
						} else if (clickWay == "CustomerCorporationInfosClick") {
							if (this_object.CorporationId != rowid) {
								for (var i in CustomerCorporationInfos) {
									if (CustomerCorporationInfos[i].CorporationId == rowid) {
										swalMsg("", "已经添加相同公司信息，无法添加，请修改原行或先删除！", "warning");
										return;
									}
								}
								$("#CustomerCorporationInfos_CorporationName").val(rowid + "-" + $("#Corporations_table").getCell(rowid, "Name"));
								this_object.CorporationId = rowid;
								this_object.CorporationName = $("#Corporations_table").getCell(rowid, "Name");
							}
						}

						$("#input_jqgrid_Corporations").hide();
					}
				});
				$("#Corporations_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
				if (way == "CustomerExpectedSalesclick") {
					dropGridOnlyShow($("#CustomerExpectedSales_CorporationName"), $("#input_jqgrid_Corporations"));
				}
				if (way == "CustomerCorporationInfosClick") {
					dropGridOnlyShow($("#CustomerCorporationInfos_CorporationName"), $("#input_jqgrid_Corporations"));
				}
			} else {
				swalNullFalseMsg("公司");
			}
		}, error: function() {
			swalNetErrorMsg("公司");
		}
	});
}

// 销售范围
var SalesDistributeRanges = null;
function getSalesDistributeRanges(way) {
	var SalesOrganizationId = "";
	for (var i in CustomerCorporationInfos) {
		SalesOrganizationId += CustomerCorporationInfos[i].CorporationId + ",";
	}
	var json = {}
	json.SalesOrganizationId = SalesOrganizationId;
	$.ajax({
		type: "post",
		url: "../share/getSalesDistributeRange.json",
		data: {jsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				SalesDistributeRanges = data.message;
				if (SalesDistributeRanges.length === 0) {
					SalesDistributeRanges = null;
					if (way != "") {
						swalEmptyMsg("销售范围");
					}
					return;
				}
				$("#SalesDistributeRanges_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: SalesDistributeRanges,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
				if (way == "CustomerSalesInfosClick") {
					dropGridOnlyShow($("#CustomerSalesInfos_SalesDistributeRangeName"), $("#input_jqgrid_SalesDistributeRanges"));
				}
				if (way == "CustomerCorporationInfosClick") {
					dropGridOnlyShow($("#CustomerCorporationInfos_CorporationName"), $("#input_jqgrid_Corporations"));
				}
			} else {
				swalNullFalseMsg("销售范围");
			}
		}, error: function() {
			swalNetErrorMsg("销售范围");
		}
	});
}

// 合作伙伴
var Partners = null;
function getPartners(way) {
	if (!this_object.SalesDistributeRangeId) {
		swalMsg("", "请先选择销售范围", "warning");
		return;
	}
	$(".await").fadeIn(300);
	var json = {};
	json.SalesDistributeRangeId = this_object.SalesDistributeRangeId;
	$.ajax({
		type: "post",
		url: "../customers/getPartners.json",
		data: {jsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
			$(".await").fadeOut(100);
			if (data.success === true) {
				Partners = data.message;
				if (Partners.length === 0) {
					Partners = null;
					if (way != "") {
						swalEmptyMsg("合作伙伴");
					}
					return;
				}
				$("#Partners_table").jqGrid("clearGridData");
				$("#Partners_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: Partners,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
				if (way == "CustomerPartnerInfosClick") {
					dropGridOnlyShow($("#CustomerPartnerInfos_PartnerName"), $("#input_jqgrid_Partners"));
				}
			} else {
				swalNullFalseMsg("合作伙伴");
			}
		}, error: function() {
			$(".await").fadeOut(100);
			swalNetErrorMsg("合作伙伴");
		}
	});
}

// 合作伙伴功能
var PartnerFunctions = null;
function getPartnerFunctions(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getPartnerFunction.json",
		data: {jsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				PartnerFunctions = data.message;
				if (PartnerFunctions.length === 0) {
					PartnerFunctions = null;
					if (way == "CustomerPartnerInfosClick") {
						swalEmptyMsg("合作伙伴功能");
					}
					return;
				}
				if (clickWay == "CustomerPartnerInfosClick") {
					this_object.PartnerFunctionId = PartnerFunctions[0].Id;
					this_object.PartnerFunctionName = PartnerFunctions[0].Name;
					$("#CustomerPartnerInfos_PartnerFunctionName").val(PartnerFunctions[0].Id + "-" + PartnerFunctions[0].Name);
				}
				var htmls = "";
				for (i = 0; i < PartnerFunctions.length; i++) {
					htmls += "<li PartnerFunctionId = " + PartnerFunctions[i].Id + ">" + PartnerFunctions[i].Id + "-" + PartnerFunctions[i].Name + "</li>";
				}
				setDropSel($("#CustomerPartnerInfos_PartnerFunctionName"), htmls);
				if (way == "CustomerPartnerInfosClick") {
					selOnlyShow($("#CustomerPartnerInfos_PartnerFunctionName"));
				}
			} else {
				swalNullFalseMsg("合作伙伴功能");
			}
		}, error: function() {
			swalNetErrorMsg("合作伙伴功能");
		}
	});
}

// 销售区域
var SalesAreas = null;
function getSalesAreas(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getSalesArea.json",
		data: {jsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				SalesAreas = data.message;
				if (SalesAreas.length === 0) {
					SalesAreas = null;
					if (way == "CustomerSalesInfosClick") {
						swalEmptyMsg("销售区域");
					}
					if (way == "add") {
						this_object.SalesOfficeId = "";
						this_object.SalesOfficeName = "";
						$("#CustomerSalesInfos_SalesAreaName").val("");
					}
					return;
				}
				if (clickWay == "CustomerSalesInfosClick") {
					//20191128	cc	#I15CAS
					//这里点击只是展示列表供选择，不需要默认赋值
					//this_object.SalesAreaId = SalesAreas[0].Id;
					//this_object.SalesAreaName = SalesAreas[0].Name;
					//$("#CustomerSalesInfos_SalesAreaName").val(SalesAreas[0].Id + "-" + SalesAreas[0].Name);
				}
				var htmls = "";
				for (i = 0; i < SalesAreas.length; i++) {
					htmls += "<li SalesAreaId = " + SalesAreas[i].Id + ">" + SalesAreas[i].Id + "-" + SalesAreas[i].Name + "</li>";
				}
				setDropSel($("#CustomerSalesInfos_SalesAreaName"), htmls);
				if (way == "CustomerSalesInfosClick") {
					selOnlyShow($("#CustomerSalesInfos_SalesAreaName"));
				}
			} else {
				swalNullFalseMsg("销售区域");
			}
		}, error: function() {
			swalNetErrorMsg("销售区域");
		}
	});
}

// 账户分配组
var AccountAssignGroups = null;
function getAccountAssignGroups(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getAccountAssignGroup.json",
		data: {jsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				AccountAssignGroups = data.message;
				if (AccountAssignGroups.length === 0) {
					AccountAssignGroups = null;
					if (way == "CustomerSalesInfosClick") {
						swalEmptyMsg("账户分配组");
					}
					return;
				}
				if (clickWay == "CustomerSalesInfosClick") {
					this_object.AccountAssignGroupId = AccountAssignGroups[0].Id;
					this_object.AccountAssignGroupName = AccountAssignGroups[0].Name;
					$("#CustomerSalesInfos_AccountAssignGroupName").val(AccountAssignGroups[0].Id + "-" + AccountAssignGroups[0].Name);
				}
				var htmls = "";
				for (i = 0; i < AccountAssignGroups.length; i++) {
					htmls += "<li AccountAssignGroupId = " + AccountAssignGroups[i].Id + ">" + AccountAssignGroups[i].Id + "-" + AccountAssignGroups[i].Name + "</li>";
				}
				setDropSel($("#CustomerSalesInfos_AccountAssignGroupName"), htmls);
				if (way == "CustomerSalesInfosClick") {
					selOnlyShow($("#CustomerSalesInfos_AccountAssignGroupName"));
				}
			} else {
				swalNullFalseMsg("账户分配组");
			}
		}, error: function() {
			swalNetErrorMsg("账户分配组");
		}
	});
}
// 客户组
var CustomerGroups = null;
function getCustomerGroups(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getCustomerGroup.json",
		data: {jsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				CustomerGroups = data.message;
				if (CustomerGroups.length === 0) {
					CustomerGroups = null;
					if (way == "CustomerSalesInfosClick") {
						swalEmptyMsg("客户组");
					}
					return;
				}
				if (clickWay == "CustomerSalesInfosClick") {
					this_object.CustomerGroupId = CustomerGroups[0].Id;
					this_object.CustomerGroupName = CustomerGroups[0].Name;
					$("#CustomerSalesInfos_CustomerGroupName").val(CustomerGroups[0].Id + "-" + CustomerGroups[0].Name);
				}
				var htmls = "";
				for (i = 0; i < CustomerGroups.length; i++) {
					htmls += "<li CustomerGroupId = " + CustomerGroups[i].Id + ">" + CustomerGroups[i].Id + "-" + CustomerGroups[i].Name + "</li>";
				}
				setDropSel($("#CustomerSalesInfos_CustomerGroupName"), htmls);
				if (way == "CustomerSalesInfosClick") {
					selOnlyShow($("#CustomerSalesInfos_CustomerGroupName"));
				}
			} else {
				swalNullFalseMsg("客户组");
			}
		}, error: function() {
			swalNetErrorMsg("客户组");
		}
	});
}
// 工厂名称
var CustomerSalesInfosFactories = null;
function getCustomerSalesInfosFactories(way) {
	if (!this_object.SalesOrganizationId) {
		swalMsg("", "请先选择销售范围", "warning");
		return;
	}
	$.ajax({
		type: "post",
		url: "../share/getFactoryName.json",
		data: {jsonData : JSON.stringify({"Id":this_object.SalesOrganizationId})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				CustomerSalesInfosFactories = data.message;
				if (CustomerSalesInfosFactories.length === 0) {
					CustomerSalesInfosFactories = null;
					if (way == "click") {
						swalEmptyMsg("工厂名称");
					}
					return;
				}
				if (way == "add") {
					$("#CustomerSalesInfos_FactoryName").val(CustomerSalesInfosFactories[0].Id + "-" + CustomerSalesInfosFactories[0].Name);
					this_object.FactoryId = CustomerSalesInfosFactories[0].Id;
					this_object.FactoryName = CustomerSalesInfosFactories[0].Name;
				}
				var htmls = "";
				for (i = 0; i < CustomerSalesInfosFactories.length; i++) {
					htmls += "<li FactoryId = " + CustomerSalesInfosFactories[i].Id + ">" + CustomerSalesInfosFactories[i].Id + "-" + CustomerSalesInfosFactories[i].Name + "</li>";
				}
				setDropSel($("#CustomerSalesInfos_FactoryName"), htmls);
				if (way == "CustomerSalesInfosClick") {
					selOnlyShow($("#CustomerSalesInfos_FactoryName"));
				}
			} else {
				swalNullFalseMsg("工厂名称");
			}
		}, error: function() {
			swalNetErrorMsg("工厂名称");
		}
	});
}

// 加载销售办公室
var CustomerSalesInfosSalesOffices = null;
function getCustomerSalesInfosSalesOffices(way) {
	if (!this_object.SalesDistributeRangeId) {
		swalMsg("", "请先选择销售范围", "warning");
		return;
	}
	$.ajax({
		type: "post",
		url: "../share/getSalesOffice.json",
		data: {jsonData : JSON.stringify({"Id":this_object.SalesDistributeRangeId})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				CustomerSalesInfosSalesOffices = data.message;
				if (CustomerSalesInfosSalesOffices.length === 0) {
					CustomerSalesInfosSalesOffices = null;
					if (way == "CustomerSalesInfosClick") {
						swalEmptyMsg("销售办公室");
					}
					return;
				}
				if (clickWay == "CustomerSalesInfosClick") {
					//20191128	cc	#I15CAS
					//这里点击只是展示销售办公司列表供选择，不需要默认拿第一条数据来给销售办公室赋值
					//this_object.SalesOfficeId = CustomerSalesInfosSalesOffices[0].Id;
					//this_object.SalesOfficeName = CustomerSalesInfosSalesOffices[0].Name;
					//$("#CustomerSalesInfos_SalesOfficeName").val(CustomerSalesInfosSalesOffices[0].Id + "-" + CustomerSalesInfosSalesOffices[0].Name);
				}
				$("#SalesOffices_table").jqGrid("clearGridData");
				$("#SalesOffices_table").jqGrid('setGridParam', {
			   	    datatype: 'local',
			   	    data: CustomerSalesInfosSalesOffices,
			   	    page: 1
		   	  	}).trigger("reloadGrid");
				if (way == "CustomerSalesInfosClick") {
					dropGridOnlyShow($("#CustomerSalesInfos_SalesOfficeName"), $("#input_jqgrid_SalesOffices"));
				}
			} else {
				swalNullFalseMsg("销售办公室");
			}
		}, error: function() {
			swalNetErrorMsg("销售办公室");
		}
	});
}
// 加载支付条款
var PaymentTerms = null;
function getPaymentTerms(way) {
	$.ajax({
		type: "post",
		url: "../share/getmenPaymentTerm.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				PaymentTerms = data.message;
				if (PaymentTerms.length === 0) {
					PaymentTerms = null;
					if (way == "click") {
						swalEmptyMsg("支付条款类型");
					}
					return;
				}
				if (clickWay == "CustomerCorporationInfosClick") {
					this_object.PaymentTermId = PaymentTerms[0].Id;
					this_object.PaymentTermName = PaymentTerms[0].Name;
					$("#CustomerCorporationInfos_PaymentTermName").val(PaymentTerms[0].Id + "-" + PaymentTerms[0].Name);
				}
				$("#PaymentTerms_table").jqGrid({
					data: PaymentTerms,
					datatype: "local",
					shrinkToFit: false,
					height: 180,
					rowNum: 10,
					rowList: [10, 20, 30],
					colNames: ["代码", "名称"],
					colModel: [
						{ name: "Id", index: "Id", align: "left", width: 150, searchoptions:{sopt:['cn']}, key : true},
						{ name: "Name", index: "Name", align: "left", width: 260, searchoptions:{sopt:['cn']}}
					],
					pager: "#PaymentTerms_table_pager",
					viewrecords: true,
					hidegrid: false,
					onSelectRow: function(rowid) {
						if (clickWay == "CustomerSalesInfosClick") {
							if (this_object.PaymentTermId != rowid) {
								this_object.PaymentTermId = rowid;
								this_object.PaymentTermName = $("#PaymentTerms_table").getCell(rowid, "Name");
								$("#CustomerSalesInfos_PaymentTermName").val(rowid + "-" + $("#PaymentTerms_table").getCell(rowid, "Name"));
							}
						} else if (clickWay == "CustomerCorporationInfosClick") {
							if (this_object.PaymentTermId != rowid) {
								this_object.PaymentTermId = rowid;
								this_object.PaymentTermName = $("#PaymentTerms_table").getCell(rowid, "Name");
								$("#CustomerCorporationInfos_PaymentTermName").val(rowid + "-" + $("#PaymentTerms_table").getCell(rowid, "Name"));
							}
						}
						$("#input_jqgrid_PaymentTerms").hide();
					}
				});
				$("#PaymentTerms_table").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
				if (way == "CustomerSalesInfosClick") {
					dropGridOnlyShow($("#CustomerSalesInfos_PaymentTermName"), $("#input_jqgrid_PaymentTerms"));
				}
				if (way == "CustomerCorporationInfosClick") {
					dropGridOnlyShow($("#CustomerCorporationInfos_PaymentTermName"), $("#input_jqgrid_PaymentTerms"));
				}
			} else {
				swalNullFalseMsg("支付条款类型");
			}
		}, error: function() {
			swalNetErrorMsg("支付条款类型");
		}
	});
}

// 加载统驭科目
var LedgerAccounts = null;
function getLedgerAccounts(way) {
	var json = {};
	json.LedgerAccounts = CustomerHeads.LedgerAccounts;
	$.ajax({
		type: "post",
		url: "../share/getLedgerAccount.json",
		data: {jsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				LedgerAccounts = data.message;
				if (LedgerAccounts.length === 0) {
					LedgerAccounts = null;
					if (way == "click") {
						swalEmptyMsg("统驭科目");
					}
					return;
				}
				if (way == "add") {
					$("#CustomerCorporationInfos_LedgerAccountName").val(LedgerAccounts[0].Id + "-" + LedgerAccounts[0].Name);
					this_object.LedgerAccountId = LedgerAccounts[0].Id;
					this_object.LedgerAccountName = LedgerAccounts[0].Name;
				}
				var htmls = "";
				for (i = 0; i < LedgerAccounts.length; i++) {
					htmls += "<li LedgerAccountId = " + LedgerAccounts[i].Id + ">" + LedgerAccounts[i].Id + "-" + LedgerAccounts[i].Name + "</li>";
				}
				setDropSel($("#CustomerCorporationInfos_LedgerAccountName"), htmls);
				if (way == "click") {
					selOnlyShow($("#CustomerCorporationInfos_LedgerAccountName"));
				}
			} else {
				swalNullFalseMsg("统驭科目");
			}
		}, error: function() {
			swalNetErrorMsg("统驭科目");
		}
	});
}

//管理机构树
var Organizations = null;
function loadOrganizations(way) {
	if (way == "click") {
		$(".await").show();
	}
	$.ajax({
		url : "../share/getOrganizations.html",
    	type : "get",
    	data: {},
    	dataType: "json",
    	success: function(data) {
    		$(".await").hide();
    		if (data.success === true) {
    			Organizations = data.message;
    			if (Organizations.length === 0) {
    				if (way == "click") {
    					swalEmptyMsg("组织机构");
    				}
    				Organizations = null;
    				return;
    			}
    			if (page_action == "new" && action_type == "new") {
    				$("#OrganizationName").val(Organizations[0].Names);
					CustomerHeads.OrganizationId = Organizations[0].Id;
					CustomerHeads.OrganizationName = Organizations[0].Names;
					CustomerHeads.OrganizationCode = Organizations[0].Code;
    			}
    			salesorgTree = "";
    			$('#organization_tree .organization_portion>ul').html(forTree(Organizations));
    			cascade("organization_tree");
    			if (way == "click") {
    				$("#organization_tree").fadeIn(0);
    			}
    		} else {
    			swalNullFalseMsg("管理机构");
    		}
    	}, error: function() {
    		$(".await").hide();
    		swalNetErrorMsg("管理机构");
    	}
	});
}

// 考核片区（管理机构）
var AppraisalZones = null;
function loadAppraisalZones(way) {
	if (!this_object.SalesOrganizationId) {
		swalMsg("", "请先选择销售范围", "warning");
		return;
	}
	if (way == "click") {
		$(".await").show();
	}
	var json = {};
	json.CorporationId = this_object.SalesOrganizationId;
	$.ajax({
		url : "../customers/getAppraisalZones.json",
		type : "post",
		data: {jsonData : JSON.stringify(json)},
		dataType: "json",
		success: function(data) {
			$(".await").hide();
			if (data.success === true) {
				AppraisalZones = data.message;
				if (AppraisalZones.length === 0) {
					if (way == "click") {
						swalEmptyMsg("组织机构");
					}
					AppraisalZones = null;
					return;
				}
				salesorgTree = "";
				$('#AppraisalZones_tree .organization_portion>ul').html(forTree(AppraisalZones));
				cascade("AppraisalZones_tree");
				if (way == "click") {
					$("#AppraisalZones_tree").fadeIn(0);
				}
			} else {
				swalNullFalseMsg("组织机构");
			}
		}, error: function() {
			$(".await").hide();
			swalNetErrorMsg("组织机构");
		}
	});
}



// 刷新树形结构
function cascade(id) {
	$("#" + id + " .organization_portion li").each(function() {
		if ($(this).find(">ul>li").length > 0) {
			$(this).find(">i").html("+");
		} else {
			$(this).find(">i").html("-");
			$(this).find(">ul").remove();
		}
	});
}

// 组织机构树处理
var salesorgTree = "";
function forTree(o) {
	for (var i = 0; i < o.length; i++) {
		salesorgTree +=  "<li><i></i><span organizationCode = '" + o[i].Code + "' organizationName = '" + o[i].Name + "' organizationIds = '" + o[i].Ids + "' organizationNames = '" + o[i].Names + "' organizationId = '" + o[i].Id + "'>" + o[i].Name + "</span><ul>";
		if (o[i]["Child"] != null){
			forTree(o[i]["Child"]);
		}
		salesorgTree += "</ul></li>";
	}
	return salesorgTree;
}

// 加载销售渠道
var DistributeTypes = null;
function getDistributeTypes(way) {
	$.ajax({
		type: "post",
		url: "../customerCommonController/getDistributeTypes.json",
		data: {JsonData : JSON.stringify({})},
		dataType: "json",
		success: function(data) {
			if (data.success === true) {
				DistributeTypes = data.message;
				if (DistributeTypes.length === 0) {
					DistributeTypes = null;
					if (way == "click") {
						swalEmptyMsg("销售渠道");
					}
					return;
				}
				if (way == "loadCustomerDistributes") {
					$("#CustomerDistributes_DistributeTypeName").val(DistributeTypes[0].Code + "-" + DistributeTypes[0].Name);
					this_object.DistributeTypeId = DistributeTypes[0].Id;
					this_object.DistributeTypeCode = DistributeTypes[0].Code;
					this_object.DistributeTypeName = DistributeTypes[0].Name;
				} else if (way == "loadCustomerMarketings") {
					$("#CustomerMarketings_DistributeTypeName").val(DistributeTypes[0].Code + "-" + DistributeTypes[0].Name);
					this_object.DistributeTypeId = DistributeTypes[0].Id;
					this_object.DistributeTypeCode = DistributeTypes[0].Code;
					this_object.DistributeTypeName = DistributeTypes[0].Name;
				}
				var htmls = "";
				for (i = 0; i < DistributeTypes.length; i++) {
					htmls += "<li DistributeTypeId = " + DistributeTypes[i].Id + ">" + DistributeTypes[i].Code + "-" + DistributeTypes[i].Name + "</li>";
				}
				setDropSel($("#CustomerDistributes_DistributeTypeName"), htmls);
				setDropSel($("#CustomerMarketings_DistributeTypeName"), htmls);
				if (way == "clickCustomerDistributes") {
					selOnlyShow($("#CustomerDistributes_DistributeTypeName"));
				}
				if (way == "clickCustomerMarketings") {
					selOnlyShow($("#CustomerMarketings_DistributeTypeName"));
				}
			} else {
				swalNullFalseMsg("销售渠道");
			}
		}, error: function() {
			swalNetErrorMsg("销售渠道");
		}
	});
}

// 删除table数据
function delJqgridCols(tableName, list) {
	var rowid = $("#" + tableName).jqGrid("getGridParam", "selrow");
	if (rowid === null) {
		swalMsg("", "请选择一条记录删除", "error");
		return false;
	}
	var o = 0;
	var validateData = false;
	for (; o < list.length; o++) {
		if (rowid == list[o].Id) {
			validateData = true;
			break;
		}
	}
	if (!validateData) {
		illegalChangeOrMemoryError();
		return;
	}
    // 权限检查
	if (tableName == "CustomerOrganizations_table" && (User_organizations != "admin" && User_organizations.indexOf(list[o].OrganizationId) == -1)) {
		swalMsg("", "您没有该组织机构的操作权限", "error");
		return;
	}
    if (tableName == "CustomerCorporationInfos_table" && (User_corporations != "admin" && User_corporations.indexOf(list[o].CorporationId) == -1)) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
    if (tableName == "CustomerSalesInfos_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].SalesOrganizationId) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }

    if (tableName == "CustomerPartnerInfos_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].SalesDistributeRangeId.substr(0, 4)) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
    if (tableName == "CustomerExpectedSales_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].CorporationId) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }

	swal({
		title: "",
        text: "您确定要删除吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnConfirm: true,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
        	list.splice(o, 1);
        	$("#" + tableName).jqGrid("delRowData", rowid);
        	$("#" + tableName).trigger('reloadGrid');
        	updIsupded(tableName);
        }
    });
}

var manager_CustomerCorporationInfos = {};
var manager_CustomerSalesInfos = {};
var manager_CustomerPartnerInfos = {};
var manager_param = {};
// 冻结
function freezeJqgridCols(tableName, list) {
	var rowid = $("#" + tableName).jqGrid("getGridParam", "selrow");
	if (rowid === null) {
		swalMsg("", "请选择一条记录冻结", "error");
		return false;
	}
	var o = 0;
	var validateData = false;
	for (; o < list.length; o++) {
		if (rowid == list[o].Id) {
			if (list[o].IsFreezed == 1) {
				swalMsg("", "该记录已经为冻结状态", "warning");
				return;
			}
			validateData = true;
			break;
		}
	}
	if (!validateData) {
		illegalChangeOrMemoryError();
		return;
	}
	// 权限检查
	if (tableName == "CustomerOrganizations_table" && (User_organizations != "admin" && User_organizations.indexOf(list[o].OrganizationId) == -1)) {
		swalMsg("", "您没有该组织机构的操作权限", "error");
		return;
	}
    if ((tableName == "CustomerCorporationInfos_table") && (User_corporations != "admin" && User_corporations.indexOf(list[o].CorporationId) == -1)) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
    if (tableName == "CustomerSalesInfos_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].SalesOrganizationId) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
    if (tableName == "CustomerPartnerInfos_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].SalesDistributeRangeId.substr(0, 4)) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
	swal({
		title: "",
        text: "您确定要冻结吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnConfirm: true,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
        	list[o].IsFreezed = 1;
        	$("#" + tableName).setRowData(rowid, list[o]);
        	$("#" + tableName).trigger('reloadGrid');
        	if (action_type == "manager_edit" && tableName == "CustomerCorporationInfos_table") {
        		if (manager_CustomerCorporationInfos.hasOwnProperty(rowid)) {
        			manager_CustomerCorporationInfos[rowid].IsFreezed = 1;
        		} else {
        			manager_param.Id = rowid;
        			manager_param.IsFreezed = 1;
        			manager_CustomerCorporationInfos[rowid] = $.extend(true, {}, manager_param);
        		}
        	}
        	if (action_type == "manager_edit" && tableName == "CustomerSalesInfos_table") {
        		if (manager_CustomerSalesInfos.hasOwnProperty(rowid)) {
        			manager_CustomerSalesInfos[rowid].IsFreezed = 1;
        		} else {
        			manager_param.Id = rowid;
        			manager_param.IsFreezed = 1;
        			manager_CustomerSalesInfos[rowid] = $.extend(true, {}, manager_param);
        		}
        	}
        	if (action_type == "manager_edit" && tableName == "CustomerPartnerInfos_table") {
        		if (manager_CustomerPartnerInfos.hasOwnProperty(rowid)) {
        			manager_CustomerPartnerInfos[rowid].IsFreezed = 1;
        		} else {
        			manager_param.Id = rowid;
        			manager_param.IsFreezed = 1;
        			manager_CustomerPartnerInfos[rowid] = $.extend(true, {}, manager_param);
        		}
        	}
        	updIsupded(tableName);
        }
    });
}

// 更新更新状态
function updIsupded(tableName) {
	tableName = tableName.substring(0, tableName.length - 6);
	if (tableName == "CustomerLinkmans") {
		isupded.CustomerLinkmans = true;
		return;
	}
	if (tableName == "CustomerDeliveryAddrs") {
		isupded.CustomerDeliveryAddrs = true;
		return;
	}
	if (tableName == "CustomerDistributes") {
		isupded.CustomerDistributes = true;
		return;
	}
	if (tableName == "CustomerMarketings") {
		isupded.CustomerMarketings = true;
		return;
	}
	if (tableName == "CustomerKithOrKins") {
		isupded.CustomerKithOrKins = true;
		return;
	}
	if (tableName == "CustomerPolicymakers") {
		isupded.CustomerPolicymakers = true;
		return;
	}
	if (tableName == "CustomerExpectedSales") {
		isupded.CustomerExpectedSales = true;
		return;
	}
	if (tableName == "CustomerOrganizations") {
		isupded.CustomerOrganizations = true;
		return;
	}
	if (tableName == "one_CustomerOrganizations") {
		isupded.CustomerOrganizations = true;
		return;
	}
	if (tableName == "CustomerCorporationInfos") {
		isupded.CustomerCorporationInfos = true;
		return;
	}
	if (tableName == "CustomerSalesInfos") {
		isupded.CustomerSalesInfos = true;
		return;
	}
	if (tableName == "CustomerPartnerInfos") {
		isupded.CustomerPartnerInfos = true;
		return;
	}
}

// 解冻
function unfreezeJqgridCols(tableName, list) {
	var rowid = $("#" + tableName).jqGrid("getGridParam", "selrow");
	if (rowid === null) {
		swalMsg("", "请选择一条记录解冻", "error");
		return false;
	}
	var o = 0;
	var validateData = false;
	for (; o < list.length; o++) {
		if (rowid == list[o].Id) {
			if (list[o].IsFreezed == 0) {
				swalMsg("", "该记录已经为未冻结状态", "warning");
				return;
			}
			validateData = true;
			break;
		}
	}
	if (!validateData) {
		illegalChangeOrMemoryError();
		return;
	}
	// 权限检查
	if (tableName == "CustomerOrganizations_table" && (User_organizations != "admin" && User_organizations.indexOf(list[o].OrganizationId) == -1)) {
		swalMsg("", "您没有该组织机构的操作权限", "error");
		return;
	}
    if ((tableName == "CustomerCorporationInfos_table") && (User_corporations != "admin" && User_corporations.indexOf(list[o].CorporationId) == -1)) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
    if (tableName == "CustomerSalesInfos_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].SalesOrganizationId) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
    if (tableName == "CustomerPartnerInfos_table" && User_corporations != "admin" && User_corporations.indexOf(list[o].SalesDistributeRangeId.substr(0, 4)) == -1) {
    	swalMsg("", "您没有该公司的操作权限", "error");
    	return;
    }
	swal({
		title: "",
		text: "您确定要解冻吗？",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		closeOnConfirm: true,
		closeOnCancel: true
	}, function(isConfirm) {
		if (isConfirm) {
			list[o].IsFreezed = 0;
			$("#" + tableName).setRowData(rowid, list[o]);
			$("#" + tableName).trigger('reloadGrid');
			if (action_type == "manager_edit" && tableName == "CustomerCorporationInfos_table") {
        		if (manager_CustomerCorporationInfos.hasOwnProperty(rowid)) {
        			manager_CustomerCorporationInfos[rowid].IsFreezed = 0;
        		} else {
        			manager_param.Id = rowid;
        			manager_param.IsFreezed = 0;
        			manager_CustomerCorporationInfos[rowid] = $.extend(true, {}, manager_param);
        		}
        	}
        	if (action_type == "manager_edit" && tableName == "CustomerSalesInfos_table") {
        		if (manager_CustomerSalesInfos.hasOwnProperty(rowid)) {
        			manager_CustomerSalesInfos[rowid].IsFreezed = 0;
        		} else {
        			manager_param.Id = rowid;
        			manager_param.IsFreezed = 0;
        			manager_CustomerSalesInfos[rowid] = $.extend(true, {}, manager_param);
        		}
        	}
        	if (action_type == "manager_edit" && tableName == "CustomerPartnerInfos_table") {
        		if (manager_CustomerPartnerInfos.hasOwnProperty(rowid)) {
        			manager_CustomerPartnerInfos[rowid].IsFreezed = 0;
        		} else {
        			manager_param.Id = rowid;
        			manager_param.IsFreezed = 0;
        			manager_CustomerPartnerInfos[rowid] = $.extend(true, {}, manager_param);
        		}
        	}
			updIsupded(tableName);
		}
	});
}

//抬头附件
function canUploadHeadsFiles() {
	$('#upload_headsFile').Huploadify({
		auto: true,
		fileTypeExts: '*.jpeg;*.jpg;*.png;*.gif;*.doc;*.docx;*.xls;*.xlsx;*.ppt;*.pdf;*.zip;*.pptx;*.txt;*.rar',
		multi: true,
		method: "post",
		fileSizeLimit: 3000*(1024),
		showUploadedPercent: true,
		showUploadedSize:true,
		buttonText: "请选择电子文件",
		removeTimeout: (0),
		uploader:'../customers/uploadFile.html',
		fileObjName:'file',
		onUploadComplete: function(file, responseText) {
			var data = JSON.parse(responseText);
			if (data.success === true) {
				var File = {};
				File.Id = getUUID();
				File.SourceName = data.message.value.name;
				File.SourcePath = data.message.value.path;
				File.SourceId = this_HeadsId;
				File.SourceType = "客户抬头";
				Files.push(File);
				isupded.Files = true;
				var fileSuffix = File.SourcePath.substring(File.SourcePath.lastIndexOf("."), File.SourcePath.length);
				var html = "<div class = 'uploadify-queue-item' id = " + File.Id + ">";
				if (fileSuffix  == '.png' || fileSuffix  == '.jpg' || fileSuffix  == '.gif') {
					html += "<span class = 'up_filename'><img target = 'blank' data-magnify = 'gallery' data-src = " + ossBasePath + File.SourcePath + " src = " + ossBasePath + File.SourcePath + ">" + File.SourceName + "</img></span>";
				} else {
					html += '<span class = "up_filename"><a target = "blank" href="' + ossBasePath + File.SourcePath+'">' + File.SourceName + '</a></span>';
				}
				html += "<a href = 'javascript:void(0);' class = 'delfilebtn deleteFile'>删除</a></div>";
				$("#heads_file_upd").find(".uploadify-queue").append(html);
			} else {
				swalMsg("", "上传附件失败", "error");
			}
		}, error:function() {
			netErrorOrTimeOutMsg();
		}
	});
}

$(function() {

	var add_edit_type = "add";
	var table = null;


	/********************************************业务联系人**************************************************/
	$("#CustomerLinkmans_add").click(function() {
		$("#CustomerLinkmansPop").find("dl").find("input").val("");
		$("#CustomerLinkman_Gender").val("男");
		this_object = {};
		if (LinkmanTypes == null) {
			getLinkmanTypes("add");
		} else {
			$("#CustomerLinkman_LinkmanTypeName").val(LinkmanTypes[0].Code + "-" + LinkmanTypes[0].Name);
			this_object.LinkmanTypeId = LinkmanTypes[0].Id;
			this_object.LinkmanTypeCode = LinkmanTypes[0].Code;
			this_object.LinkmanTypeName = LinkmanTypes[0].Name;
		}
		$("#CustomerLinkmansPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击联系人类型
	$("#CustomerLinkman_LinkmanTypeName").click(function() {
		if (LinkmanTypes === null) {
			getLinkmanTypes("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择联系人类型
	$("#CustomerLinkman_LinkmanTypeName").parent("label").on("click", ".ulinput li", function() {
		var LinkmanTypeId = $(this).attr("LinkmanTypeId");
		if (LinkmanTypeId == this_object.LinkmanTypeId) {
			return;
		}
		for (var i = 0; i < LinkmanTypes.length; i++) {
			if (LinkmanTypeId == LinkmanTypes[i].Id) {
				this_object.LinkmanTypeId = LinkmanTypes[i].Id;
				this_object.LinkmanTypeCode = LinkmanTypes[i].Code;
				this_object.LinkmanTypeName = LinkmanTypes[i].Name;
				break;
			}
		}
	});

	// 点击性别
	$("#CustomerLinkman_Gender").click(function() {
		selOnlyShow($(this));
	});

	// 提交
	$("#CustomerLinkmans_form").validate({
		rules:{
			CustomerLinkman_LinkmanTypeName: {
				required:true
			},
			CustomerLinkman_Name: {
				required:true
			},
			CustomerLinkman_Gender: {
				required:true
			},
			CustomerLinkman_IdCard: {
				minlength : 15
			},
			CustomerLinkman_Mobile: {
				required : true,
	            minlength : 8
			},
			CustomerLinkman_Email: {
				email:true
			}
		},
		messages:{
			CustomerLinkman_LinkmanTypeName: {
				required:"请选择类型"
			},
			CustomerLinkman_Name: {
				required:"请输入姓名"
			},
			CustomerLinkman_Gender: {
				required:"请选择性别"
			},
			CustomerLinkman_IdCard: {
				minlength : "最少15位"
			},
			CustomerLinkman_Mobile: {
			    required : "请输入手机号",
		        minlength : "不能小于8位"
			},
			CustomerLinkman_Email: {
				email:"请输入正确邮箱"
			}
		},
		submitHandler: function() {
			this_object.Name = $("#CustomerLinkman_Name").val();
			this_object.Gender = $("#CustomerLinkman_Gender").val() == "男" ? 1 : 0;
			this_object.IdCard = $("#CustomerLinkman_IdCard").val();
			this_object.Mobile = $("#CustomerLinkman_Mobile").val();
			this_object.Email = $("#CustomerLinkman_Email").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerLinkmans_table").jqGrid("addRowData", $("#CustomerLinkmans_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerLinkmans.push(this_object);
			} else {
				$("#CustomerLinkmans_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerLinkmans) {
		 	    	if (CustomerLinkmans[i].Id == this_object.Id) {
		 	    		CustomerLinkmans[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerLinkmans = true;
			$("#CustomerLinkmans_table").trigger("reloadGrid");
			$("#CustomerLinkmansPop").fadeOut(100);
		}, highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 点击编辑
	$("#CustomerLinkmans_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerLinkmans_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerLinkmans) {
 	    	if (CustomerLinkmans[i].Id == Id) {
 	    		this_object = CustomerLinkmans[i];
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    $("#CustomerLinkmansPop").find("dl").find("input").val("");

 	    $("#CustomerLinkman_LinkmanTypeName").val(this_object.LinkmanTypeCode + "-" + this_object.LinkmanTypeName);
 	    $("#CustomerLinkman_Name").val(this_object.Name);
		$("#CustomerLinkman_Gender").val(this_object.Gender == 1 ? "男" : "女");
		$("#CustomerLinkman_IdCard").val(this_object.IdCard);
		$("#CustomerLinkman_Mobile").val(this_object.Mobile);
		$("#CustomerLinkman_Email").val(this_object.Email);
		$("#CustomerLinkmansPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 点击删除
	$("#CustomerLinkmans_del").click(function() {
		delJqgridCols("CustomerLinkmans_table", CustomerLinkmans);
	});

	/*****************************************************送货信息************************************************************************/
	// 新增
	$("#CustomerDeliveryAddrs_add").click(function() {
		$("#CustomerDeliveryAddrsPop").find("dl").find("input").val("");
		$("#CustomerDeliveryAddrs_IsStandard").val("否");
		this_object = {};
		if (DeliveryAddressTypes == null) {
			getDeliveryAddressTypes("add", this_object);
		} else {
			$("#CustomerDeliveryAddrs_DeliveryAddressTypeName").val(DeliveryAddressTypes[0].Code + "-" + DeliveryAddressTypes[0].Name);
			this_object.DeliveryAddressTypeId = DeliveryAddressTypes[0].Id;
			this_object.DeliveryAddressTypeCode = DeliveryAddressTypes[0].Code;
			this_object.DeliveryAddressTypeName = DeliveryAddressTypes[0].Name;
		}
		$("#CustomerDeliveryAddrsPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击送货地址类型
	$("#CustomerDeliveryAddrs_DeliveryAddressTypeName").click(function() {
		if (DeliveryAddressTypes === null) {
			getDeliveryAddressTypes("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择送货地址类型
	$("#CustomerDeliveryAddrs_DeliveryAddressTypeName").parent("label").on("click", ".ulinput li", function() {
		var DeliveryAddressTypeId = $(this).attr("DeliveryAddressTypeId");
		if (DeliveryAddressTypeId == this_object.DeliveryAddressTypeId) {
			return;
		}
		for (var i = 0; i < DeliveryAddressTypes.length; i++) {
			if (DeliveryAddressTypeId == DeliveryAddressTypes[i].Id) {
				this_object.DeliveryAddressTypeId = DeliveryAddressTypes[i].Id;
				this_object.DeliveryAddressTypeCode = DeliveryAddressTypes[i].Code;
				this_object.DeliveryAddressTypeName = DeliveryAddressTypes[i].Name;
				break;
			}
		}
	});

	// 点击是否默认
	$("#CustomerDeliveryAddrs_IsStandard").click(function() {
		selOnlyShow($(this));
	});

	// 提交
	$("#CustomerDeliveryAddrs_form").validate({
		rules:{
			CustomerDeliveryAddrs_DeliveryAddressTypeName: {
				required:true
			},
			CustomerDeliveryAddrs_RegionPath: {
				required:true
			},
			CustomerDeliveryAddrs_Mobile: {
				required:true,
				minlength:8
			}
		},
		messages:{
			CustomerDeliveryAddrs_DeliveryAddressTypeName: {
				required:"请选择地址类型"
			},
			CustomerDeliveryAddrs_RegionPath: {
				required:"请选择区域"
			},
			CustomerDeliveryAddrs_Mobile: {
			    required : "请输入电话号码",
		        minlength : "不能小于8位"
			},
		},
		submitHandler: function() {
			this_object.IsStandard = $("#CustomerDeliveryAddrs_IsStandard").val() == "是" ? 1 : 0;
			if (this_object.IsStandard) {
				for (var i in CustomerDeliveryAddrs) {
					if (CustomerDeliveryAddrs[i].IsStandard == 1) {
						swalMsg("", "只能设置一条默认地址，请先取消其他默认", "warning");
						$("#CustomerDeliveryAddrs_IsStandard").val("否");
						return;
					}
				}
			}
			this_object.RegionPath = $("#CustomerDeliveryAddrs_RegionPath").val();
			this_object.Address = $("#CustomerDeliveryAddrs_Address").val();
			this_object.Linkman = $("#CustomerDeliveryAddrs_Linkman").val();
			this_object.Mobile = $("#CustomerDeliveryAddrs_Mobile").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerDeliveryAddrs_table").jqGrid("addRowData", $("#CustomerDeliveryAddrs_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerDeliveryAddrs.push(this_object);
			} else {
				$("#CustomerDeliveryAddrs_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerDeliveryAddrs) {
		 	    	if (CustomerDeliveryAddrs[i].Id == this_object.Id) {
		 	    		CustomerDeliveryAddrs[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerDeliveryAddrs = true;
			$("#CustomerDeliveryAddrs_table").trigger("reloadGrid");
			$("#CustomerDeliveryAddrsPop").fadeOut(100);
		}, highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerDeliveryAddrs_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerDeliveryAddrs_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerDeliveryAddrs) {
 	    	if (CustomerDeliveryAddrs[i].Id == Id) {
 	    		this_object = $.extend(true, {}, CustomerDeliveryAddrs[i]);
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    $("#CustomerDeliveryAddrsPop").find("dl").find("input").val("");

 	    $("#CustomerDeliveryAddrs_DeliveryAddressTypeName").val(this_object.DeliveryAddressTypeCode + "-" + this_object.DeliveryAddressTypeName);
 	    $("#CustomerDeliveryAddrs_IsStandard").val(this_object.IsStandard ? "是" : "否");
		$("#CustomerDeliveryAddrs_RegionPath").val(this_object.RegionPath);
		$("#CustomerDeliveryAddrs_Address").val(this_object.Address);
		$("#CustomerDeliveryAddrs_Linkman").val(this_object.Linkman);
		$("#CustomerDeliveryAddrs_Mobile").val(this_object.Mobile);
		$("#CustomerDeliveryAddrsPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerDeliveryAddrs_del").click(function() {
		delJqgridCols("CustomerDeliveryAddrs_table", CustomerDeliveryAddrs);
	});

	/**********************************************************能力信息*******************************************************/
	/*********************************************************渠道运营现状分析*******************************************************/
	// 新增
	$("#CustomerDistributes_add").click(function() {
		$("#CustomerDistributesPop").find("dl").find("input").val("");
		this_object = {};
		if (DistributeTypes == null) {
			getDistributeTypes("loadCustomerDistributes");
		} else {
			$("#CustomerDistributes_DistributeTypeName").val(DistributeTypes[0].Code + "-" + DistributeTypes[0].Name);
			this_object.DistributeTypeId = DistributeTypes[0].Id;
			this_object.DistributeTypeCode = DistributeTypes[0].Code;
			this_object.DistributeTypeName = DistributeTypes[0].Name;
		}
		$("#CustomerDistributesPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击销售渠道
	$("#CustomerDistributes_DistributeTypeName").click(function() {
		if (DistributeTypes == null) {
			getDistributeTypes("clickCustomerDistributes");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择销售渠道
	$("#CustomerDistributes_DistributeTypeName").parent("label").on("click", ".ulinput li", function() {
		var DistributeTypeId = $(this).attr("DistributeTypeId");
		if (DistributeTypeId == this_object.DistributeTypeId) {
			return;
		}
		for (var i = 0; i < DistributeTypes.length; i++) {
			if (DistributeTypeId == DistributeTypes[i].Id) {
				this_object.DistributeTypeId = DistributeTypes[i].Id;
				this_object.DistributeTypeCode = DistributeTypes[i].Code;
				this_object.DistributeTypeName = DistributeTypes[i].Name;
				break;
			}
		}
	});

	// 提交
	$("#CustomerDistributes_form").validate({
		rules:{
			CustomerDistributes_DistributeTypeName: {
				required:true
			},
			CustomerDistributes_CoverageRate: {
				 number:true, max:100
			},
			CustomerDistributes_Amount: {
				required:true
			},
			CustomerDistributes_SalesRate: {
				number:true, max:100
			}
		},
		messages:{
			CustomerDistributes_DistributeTypeName: {
				required:"请选择渠道"
			},
			CustomerDistributes_CoverageRate: {
				number:"请输入数字",max:"不超过100"
			},
			CustomerDistributes_Amount: {
				required:"请输入数量"
			},
			CustomerDistributes_SalesRate: {
				number:"请输入数字",max:"不超过100"
			}
		},
		submitHandler: function() {
			this_object.Amount = $("#CustomerDistributes_Amount").val();
			this_object.CoverageRate = $("#CustomerDistributes_CoverageRate").val() ? $("#CustomerDistributes_CoverageRate").val() : null;
			this_object.Ranking = $("#CustomerDistributes_Ranking").val() ? $("#CustomerDistributes_Ranking").val() : null;
			this_object.SalesRate = $("#CustomerDistributes_SalesRate").val() ? $("#CustomerDistributes_SalesRate").val() : null;
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerDistributes_table").jqGrid("addRowData", $("#CustomerDistributes_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerDistributes.push(this_object);
			} else {
				$("#CustomerDistributes_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerDistributes) {
		 	    	if (CustomerDistributes[i].Id == this_object.Id) {
		 	    		CustomerDistributes[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerDistributes = true;
			$("#CustomerDistributes_table").trigger("reloadGrid");
			$("#CustomerDistributesPop").fadeOut(100);
		}, highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerDistributes_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerDistributes_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerDistributes) {
 	    	if (CustomerDistributes[i].Id == Id) {
 	    		this_object = CustomerDistributes[i];
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    $("#CustomerDistributesPop").find("dl").find("input").val("");

 	    $("#CustomerDistributes_DistributeTypeName").val(this_object.DistributeTypeCode + "-" + this_object.DistributeTypeName);
 	    $("#CustomerDistributes_Amount").val(this_object.Amount);
		$("#CustomerDistributes_CoverageRate").val(this_object.CoverageRate);
		$("#CustomerDistributes_Ranking").val(this_object.Ranking);
		$("#CustomerDistributes_SalesRate").val(this_object.SalesRate);
		$("#CustomerDistributesPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerDistributes_del").click(function() {
		delJqgridCols("CustomerDistributes_table", CustomerDistributes);
	});

	/*******************************************************品牌运营现状*************************************************************/
	// 新增
	$("#CustomerMarketings_add").click(function() {
		$("#CustomerMarketingsPop").find("dl").find("input").val("");
		this_object = {};
		if (DistributeTypes == null) {
			getDistributeTypes("loadCustomerMarketings");
		} else {
			$("#CustomerMarketings_DistributeTypeName").val(DistributeTypes[0].Code + "-" + DistributeTypes[0].Name);
			this_object.DistributeTypeId = DistributeTypes[0].Id;
			this_object.DistributeTypeCode = DistributeTypes[0].Code;
			this_object.DistributeTypeName = DistributeTypes[0].Name;
		}
		$("#CustomerMarketings_GrowthPotential").val("好");
		$("#CustomerMarketings_FactoryRelation").val("好");
		$("#CustomerMarketingsPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击销售渠道
	$("#CustomerMarketings_DistributeTypeName").click(function() {
		if (DistributeTypes == null) {
			getDistributeTypes("clickCustomerMarketings");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择销售渠道
	$("#CustomerMarketings_DistributeTypeName").parent("label").on("click", ".ulinput li", function() {
		var DistributeTypeId = $(this).attr("DistributeTypeId");
		if (DistributeTypeId == this_object.DistributeTypeId) {
			return;
		}
		for (var i = 0; i < DistributeTypes.length; i++) {
			if (DistributeTypeId == DistributeTypes[i].Id) {
				this_object.DistributeTypeId = DistributeTypes[0].Id;
				this_object.DistributeTypeCode = DistributeTypes[0].Code;
				this_object.DistributeTypeName = DistributeTypes[0].Name;
				break;
			}
		}
	});

	// 点击增长潜力
	$("#CustomerMarketings_GrowthPotential").click(function() {
		selOnlyShow($(this));
	});

	// 点击厂家关系
	$("#CustomerMarketings_FactoryRelation").click(function() {
		selOnlyShow($(this));
	});

	// 提交
	$("#CustomerMarketings_form").validate({
		rules:{
			CustomerMarketings_Brand: {
				required:true
			},
			CustomerMarketings_Price: {
				required:true
			},
			CustomerMarketings_AnnualSales: {
				required:true
			},
			CustomerMarketings_MarginRate: {
				required:true, number:true, max:100
			},
			CustomerMarketings_ContractYear: {
				required:true
			},
			CustomerMarketings_BeginYear: {
				required:true
			}
		},
		messages:{
			CustomerMarketings_Brand: {
				required:"请输入品牌"
			},
			CustomerMarketings_Price: {
				required:"请输入供价"
			},
			CustomerMarketings_AnnualSales: {
				required:"请输入销售额"
			},
			CustomerMarketings_MarginRate: {
				required:"请输入毛利", max : "不能超过100", number: "只能输入数字"
			},
			CustomerMarketings_ContractYear: {
				required:"请输入合同期"
			},
			CustomerMarketings_BeginYear: {
				required:"请输入起始年"
			}
		},
		submitHandler: function() {
			this_object.Brand = $("#CustomerMarketings_Brand").val();
			this_object.Price = $("#CustomerMarketings_Price").val();
			this_object.AnnualSales = $("#CustomerMarketings_AnnualSales").val();
			this_object.MarginRate = $("#CustomerMarketings_MarginRate").val();
			this_object.ContractYear = $("#CustomerMarketings_ContractYear").val();
			this_object.BeginYear = $("#CustomerMarketings_BeginYear").val();
			this_object.GrowthPotential = $("#CustomerMarketings_GrowthPotential").val();
			this_object.FactoryRelation = $("#CustomerMarketings_FactoryRelation").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerMarketings_table").jqGrid("addRowData", $("#CustomerMarketings_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerMarketings.push(this_object);
			} else {
				$("#CustomerMarketings_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerMarketings) {
		 	    	if (CustomerMarketings[i].Id == this_object.Id) {
		 	    		CustomerMarketings[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerMarketings = true;
			$("#CustomerMarketings_table").trigger("reloadGrid");
			$("#CustomerMarketingsPop").fadeOut(100);
		},
		highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	$("#CustomerMarketings_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerMarketings_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerMarketings) {
 	    	if (CustomerMarketings[i].Id == Id) {
 	    		this_object = CustomerMarketings[i];
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    $("#CustomerMarketingsPop").find("dl").find("input").val("");

 	    $("#CustomerMarketings_DistributeTypeName").val(this_object.DistributeTypeCode + "-" + this_object.DistributeTypeName);
 	    $("#CustomerMarketings_Brand").val(this_object.Brand);
		$("#CustomerMarketings_Price").val(this_object.Price);
		$("#CustomerMarketings_AnnualSales").val(this_object.AnnualSales);
		$("#CustomerMarketings_MarginRate").val(this_object.MarginRate);
		$("#CustomerMarketings_ContractYear").val(this_object.ContractYear);
		$("#CustomerMarketings_BeginYear").val(this_object.BeginYear);
		$("#CustomerMarketings_GrowthPotential").val(this_object.GrowthPotential);
		$("#CustomerMarketings_FactoryRelation").val(this_object.FactoryRelation);
		$("#CustomerMarketingsPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerMarketings_del").click(function() {
		delJqgridCols("CustomerMarketings_table", CustomerMarketings);
	});

	/****************************************************和公司现有关系*********************************************************/
	// 新增
	$("#CustomerKithOrKins_add").click(function() {
		$("#CustomerKithOrKinsPop").find("dl").find("input").val("");
		this_object = {};
		$("#CustomerKithOrKinsPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 提交
	$("#CustomerKithOrKins_form").validate({
		rules:{
			CustomerKithOrKins_Name: {
				required:true
			},
			CustomerKithOrKins_Relation: {
				required:true
			}
		},
		messages:{
			CustomerKithOrKins_Name: {
				required:"请输入名称"
			},
			CustomerKithOrKins_Relation: {
				required:"请输入关系"
			}
		},
		submitHandler: function() {
			this_object.Name = $("#CustomerKithOrKins_Name").val();
			this_object.Relation = $("#CustomerKithOrKins_Relation").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerKithOrKins_table").jqGrid("addRowData", $("#CustomerMarketings_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerKithOrKins.push(this_object);
			} else {
				$("#CustomerKithOrKins_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerKithOrKins) {
		 	    	if (CustomerKithOrKins[i].Id == this_object.Id) {
		 	    		CustomerKithOrKins[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerKithOrKins = true;
			$("#CustomerKithOrKins_table").trigger("reloadGrid");
			$("#CustomerKithOrKinsPop").fadeOut(100);
		},
		highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerKithOrKins_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerKithOrKins_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerKithOrKins) {
 	    	if (CustomerKithOrKins[i].Id == Id) {
 	    		this_object = CustomerKithOrKins[i];
 	    		break;
 	    	}
 	    }
 	    if (CustomerKithOrKins == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    $("#CustomerKithOrKinsPop").find("dl").find("input").val("");

 	    $("#CustomerKithOrKins_Name").val(this_object.Name);
 	    $("#CustomerKithOrKins_Relation").val(this_object.Relation);
		$("#CustomerKithOrKinsPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerKithOrKins_del").click(function() {
		delJqgridCols("CustomerKithOrKins_table", CustomerKithOrKins);
	});

	/****************************************************************企业决策人信息********************************************************/
	$("#CustomerPolicymakers_add").click(function() {
		$("#CustomerPolicymakersPop").find("dl").find("input").val("");
		this_object = {};
		$("#CustomerPolicymakersPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 提交
	$("#CustomerPolicymakers_form").validate({
		rules:{
			CustomerPolicymakers_Name: {
				required:true
			},
			CustomerPolicymakers_Favorite: {
				required:true
			},
			CustomerPolicymakers_WorkYears: {
				required:true
			},
			CustomerPolicymakers_OperationPrinciple: {
				required:true
			},
			CustomerPolicymakers_CharacterAnalysis: {
				required:true
			}
		}, messages:{
			CustomerPolicymakers_Name: {
				required:"请输入姓名"
			},
			CustomerPolicymakers_Favorite: {
				required:"请输入爱好"
			},
			CustomerPolicymakers_WorkYears: {
				required:"请输入从业年限"
			},
			CustomerPolicymakers_OperationPrinciple: {
				required:"请输入经营理念"
			},
			CustomerPolicymakers_CharacterAnalysis: {
				required:"请输入性格"
			}
		}, submitHandler: function() {
			this_object.Name = $("#CustomerPolicymakers_Name").val();
			this_object.Favorite = $("#CustomerPolicymakers_Favorite").val();
			this_object.WorkYears = $("#CustomerPolicymakers_WorkYears").val();
			this_object.SocietyRelation = $("#CustomerPolicymakers_SocietyRelation").val();
			this_object.OperationPrinciple = $("#CustomerPolicymakers_OperationPrinciple").val();
			this_object.CharacterAnalysis = $("#CustomerPolicymakers_CharacterAnalysis").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerPolicymakers_table").jqGrid("addRowData", $("#CustomerPolicymakers_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerPolicymakers.push(this_object);
			} else {
				$("#CustomerPolicymakers_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerPolicymakers) {
		 	    	if (CustomerPolicymakers[i].Id == this_object.Id) {
		 	    		CustomerPolicymakers[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerPolicymakers = true;
			$("#CustomerPolicymakers_table").trigger("reloadGrid");
			$("#CustomerPolicymakersPop").fadeOut(100);
		}, highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerPolicymakers_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerPolicymakers_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerPolicymakers) {
 	    	if (CustomerPolicymakers[i].Id == Id) {
 	    		this_object = CustomerPolicymakers[i];
 	    		break;
 	    	}
 	    }
 	    if (CustomerPolicymakers == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    $("#CustomerPolicymakersPop").find("dl").find("input").val("");

 	    $("#CustomerPolicymakers_Name").val(this_object.Name);
		$("#CustomerPolicymakers_Favorite").val(this_object.Favorite);
		$("#CustomerPolicymakers_WorkYears").val(this_object.WorkYears);
		$("#CustomerPolicymakers_SocietyRelation").val(this_object.SocietyRelation);
		$("#CustomerPolicymakers_OperationPrinciple").val(this_object.OperationPrinciple);
		$("#CustomerPolicymakers_CharacterAnalysis").val(this_object.CharacterAnalysis);
		$("#CustomerPolicymakersPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerPolicymakers_del").click(function() {
		delJqgridCols("CustomerPolicymakers_table", CustomerPolicymakers);
	});

	/******************************************************开户预期销售信息****************************************************/

	// 新增
	$("#CustomerExpectedSales_add").click(function() {
		$("#CustomerExpectedSalesPop").find("dl").find("input").val("");
		clickWay = "CustomerExpectedSalesclick";
		this_object = {};
		if (Corporations == null) {
			getCorporations("");
		}
		$("#CustomerExpectedSalesPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击选择公司
	$("#CustomerExpectedSales_CorporationName").click(function() {
		if (Corporations === null) {
			getCorporations("CustomerExpectedSalesclick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_Corporations"));
		}
	});

	// 提交表单
	$("#CustomerExpectedSales_form").validate({
		rules:{
			CustomerExpectedSales_CorporationName: {
				required:true
			},
			CustomerExpectedSales_ProductRemark: {
				required:true
			},
			CustomerExpectedSales_SalesTarget: {
				required:true
			},
			CustomerExpectedSales_PriceLevel: {
				required:true
			},
			CustomerExpectedSales_FirstBackMoney: {
				required:true
			}
		},
		messages:{
			CustomerExpectedSales_CorporationName: {
				required:"请选择公司"
			},
			CustomerExpectedSales_ProductRemark: {
				required:"请输入产品"
			},
			CustomerExpectedSales_SalesTarget: {
				required:"请输入销售目标"
			},
			CustomerExpectedSales_PriceLevel: {
				required:"请输入价位"
			},
			CustomerExpectedSales_FirstBackMoney: {
				required:"请输入回款额"
			}
		},
		submitHandler: function() {
			this_object.SalesStartDate = $("#CustomerExpectedSales_SalesStartDate").val() ?  $("#CustomerExpectedSales_SalesStartDate").val() : null;
			this_object.SalesEndDate = $("#CustomerExpectedSales_SalesEndDate").val() ?  $("#CustomerExpectedSales_SalesEndDate").val() : null;
			this_object.SalesRemark = $("#CustomerExpectedSales_SalesRemark").val();
			this_object.ProductRemark = $("#CustomerExpectedSales_ProductRemark").val();
			this_object.SalesTarget = $("#CustomerExpectedSales_SalesTarget").val();
			this_object.PriceLevel = $("#CustomerExpectedSales_PriceLevel").val();
			this_object.FirstBackMoney = $("#CustomerExpectedSales_FirstBackMoney").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				$("#CustomerExpectedSales_table").jqGrid("addRowData", $("#CustomerExpectedSales_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerExpectedSales.push(this_object);
			} else {
				$("#CustomerExpectedSales_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerExpectedSales) {
		 	    	if (CustomerExpectedSales[i].Id == this_object.Id) {
		 	    		CustomerExpectedSales[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerExpectedSales = true;
			$("#CustomerExpectedSales_table").trigger("reloadGrid");
			$("#CustomerExpectedSalesPop").fadeOut(100);
		},
		highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerExpectedSales_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerExpectedSales_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerExpectedSales) {
 	    	if (CustomerExpectedSales[i].Id == Id) {
 	    		this_object = $.extend(true, {}, CustomerExpectedSales[i]);;
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    // 权限检查
 	    if (User_corporations != "admin" && User_corporations.indexOf(this_object.CorporationId) == -1) {
 	    	swalMsg("", "您没有该公司的操作权限", "error");
 	    	return;
 	    }
 	    clickWay = "CustomerExpectedSalesclick";
 	    $("#CustomerExpectedSalesPop").find("dl").find("input").val("");

 	    $("#CustomerExpectedSales_CorporationName").val(this_object.CorporationId + "-" + this_object.CorporationName);
 	    $("#CustomerExpectedSales_SalesRegionName").val(this_object.SalesRegionName);
		$("#CustomerExpectedSales_SalesStartDate").val(this_object.SalesStartDate ? getDate(new Date(this_object.SalesStartDate)) : '');
		$("#CustomerExpectedSales_SalesEndDate").val(this_object.SalesEndDate ? getDate(new Date(this_object.SalesEndDate)) : '');
		$("#CustomerExpectedSales_SalesRemark").val(this_object.SalesRemark);
		$("#CustomerExpectedSales_ProductRemark").val(this_object.ProductRemark);
		$("#CustomerExpectedSales_SalesTarget").val(this_object.SalesTarget);
		$("#CustomerExpectedSales_PriceLevel").val(this_object.PriceLevel);
		$("#CustomerExpectedSales_FirstBackMoney").val(this_object.FirstBackMoney);
		$("#CustomerExpectedSalesPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerExpectedSales_del").click(function() {
		delJqgridCols("CustomerExpectedSales_table", CustomerExpectedSales);
	});
	/***********************************************************管理机构*****************************************************************/
	// 点击管理机构
	var organizationClickWay = "";
	$("#CustomerOrganizations_add").click(function() {
		organizationClickWay = "CustomerOrganizations";
		this_object = {};
		if (Organizations === null) {
			loadOrganizations("click");
		} else {
			$("#organization_tree").fadeIn(0);
		}
	});

	// 展开树
	$("#organization_tree .organization_portion").on("click", "li i", function() {
		$(this).siblings("ul").slideToggle(100);
	});

	// 选择管理机构
	$("#organization_tree .organization_portion").on("click", "li span", function() {
		var OrganizationId = $(this).attr("organizationId");
		if (organizationClickWay == "CustomerHeads") {
			CustomerHeads.OrganizationId = OrganizationId;
			CustomerHeads.OrganizationCode = $(this).attr("organizationCode");
			CustomerHeads.OrganizationName = $(this).attr("organizationNames");
			$("#OrganizationName").val(CustomerHeads.OrganizationName);
		} else if (organizationClickWay == "CustomerOrganizations" || organizationClickWay == "one_CustomerOrganizations") {
			for (var i in CustomerOrganizations) {
				if (CustomerOrganizations[i].OrganizationId == OrganizationId) {
					swalMsg("", "请勿添加重复管理机构", "warning");
					$("#organization_tree").fadeOut(100);
					return;
				}
			}
			this_object.Id = getUUID();
			this_object.HeadsId = this_HeadsId;
			this_object.OrganizationId = OrganizationId;
			this_object.OrganizationCode = $(this).attr("organizationCode");
			this_object.OrganizationName = $(this).attr("organizationName");
			this_object.OrganizationIds = $(this).attr("organizationIds");
			this_object.OrganizationPath = $(this).attr("organizationNames");
			this_object.IsFreezed = 0;
			if (organizationClickWay == "CustomerOrganizations") {
				$("#CustomerOrganizations_table").jqGrid("addRowData", $("#CustomerOrganizations_table").jqGrid('getDataIDs') + 1, this_object, "last");
			} else if (organizationClickWay == "one_CustomerOrganizations") {
				$("#one_CustomerOrganizations_table").jqGrid("addRowData", $("#one_CustomerOrganizations_table").jqGrid('getDataIDs') + 1, this_object, "last");
			}
			CustomerOrganizations.push(this_object);
			isupded.CustomerOrganizations = true;
		}
		$("#CustomerOrganizations_table").trigger("reloadGrid");
		$("#organization_tree").fadeOut(0);
	});

	// 删除
	$("#CustomerOrganizations_del").click(function() {
		delJqgridCols("CustomerOrganizations_table", CustomerOrganizations);
	});

	// 冻结
	$("#CustomerOrganizations_freeze").click(function() {
		freezeJqgridCols("CustomerOrganizations_table", CustomerOrganizations);
	});

	// 解冻
	$("#CustomerOrganizations_unfreeze").click(function() {
		unfreezeJqgridCols("CustomerOrganizations_table", CustomerOrganizations);
	});
	/**************************************************************公司信息****************************************************/
	// 新增
	$("#CustomerCorporationInfos_add").click(function() {
		$("#CustomerCorporationInfosPop").find("dl").find("input").val("");
		clickWay = "CustomerCorporationInfosClick";
		this_object = {};
		if (Corporations == null) {
			getCorporations("add");
		}
		// 支付条款
		if (PaymentTerms == null) {
			getPaymentTerms("");
		} else {
			this_object.PaymentTermId = PaymentTerms[0].Id;
			this_object.PaymentTermName = PaymentTerms[0].Name;
			$("#CustomerCorporationInfos_PaymentTermName").val(PaymentTerms[0].Id + "-" + PaymentTerms[0].Name);
		}
		// 统驭科目
		if (LedgerAccounts === null) {
			getLedgerAccounts("add");
		} else {
			this_object.LedgerAccountId = LedgerAccounts[0].Id;
			this_object.LedgerAccountName = LedgerAccounts[0].Name;
			$("#CustomerCorporationInfos_LedgerAccountName").val(LedgerAccounts[0].Id + "-" + LedgerAccounts[0].Name);
		}
		// 开票类型
		if (InvoiceTypes === null) {
			getInvoiceTypes("");
		} else {
			if (CustomerHeads.InvoiceTypeId) {
				this_object.InvoiceTypeId = CustomerHeads.InvoiceTypeId;
				this_object.InvoiceTypeCode = CustomerHeads.InvoiceTypeCode;
				this_object.InvoiceTypeErpCode = CustomerHeads.InvoiceTypeErpCode;
				this_object.InvoiceTypeName = CustomerHeads.InvoiceTypeName;
				//20190731	cc	#IZRVK
				for (var i = 0; i < InvoiceTypes.length; i++) {
					if ( CustomerHeads.InvoiceTypeId == InvoiceTypes[i].Id )
					{
						this_object.InvoiceTypeId = InvoiceTypes[i].Id;
						this_object.InvoiceTypeCode = InvoiceTypes[i].Code;
						this_object.InvoiceTypeErpCode = InvoiceTypes[i].ErpCode;
						this_object.InvoiceTypeName = InvoiceTypes[i].Name;
						break;
					}
				}
				$("#CustomerCorporationInfos_InvoiceTypeName").val(this_object.InvoiceTypeErpCode + "-" + this_object.InvoiceTypeName);
			}
		}
		$("#CustomerCorporationInfos_InvoiceReceiver").val($("#InvoiceReceiver").val());
		$("#CustomerCorporationInfos_InvoiceReceiverTele").val($("#InvoiceReceiverTele").val());
		$("#CustomerCorporationInfosPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击选择公司
	$("#CustomerCorporationInfos_CorporationName").click(function() {
		if (Corporations === null) {
			getCorporations("CustomerCorporationInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_Corporations"));
		}
	});

	// 点击统驭科目
	$("#CustomerCorporationInfos_LedgerAccountName").click(function() {
		if (LedgerAccounts === null) {
			getLedgerAccounts("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择统驭科目
	$("#CustomerCorporationInfos_LedgerAccountName").parent("label").on("click", ".ulinput li", function() {
		var LedgerAccountId = $(this).attr("LedgerAccountId");
		if (LedgerAccountId == this_object.LedgerAccountId) {
			return;
		}
		for (var i = 0; i < LedgerAccounts.length; i++) {
			if (LedgerAccountId == LedgerAccounts[i].Id) {
				this_object.LedgerAccountId = LedgerAccounts[i].Id;
				this_object.LedgerAccountName = LedgerAccounts[i].Name;
				break;
			}
		}
	});

	// 点击支付条款
	$("#CustomerCorporationInfos_PaymentTermName").click(function() {
		if (PaymentTerms === null) {
			getPaymentTerms("CustomerCorporationInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_PaymentTerms"));
		}
	});

	// 点击开票类型
	$("#CustomerCorporationInfos_InvoiceTypeName").click(function() {
		if (InvoiceTypes === null) {
			getInvoiceTypes("CustomerCorporationInfosClick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择开票类型
	$("#CustomerCorporationInfos_InvoiceTypeName").parent("label").on("click", ".ulinput li", function() {
		var InvoiceTypeId = $(this).attr("InvoiceTypeId");
		if (InvoiceTypeId == this_object.InvoiceTypeId) {
			return;
		}
		for (var i = 0; i < InvoiceTypes.length; i++) {
			if (InvoiceTypeId == InvoiceTypes[i].Id) {
				this_object.InvoiceTypeId = InvoiceTypes[i].Id;
				this_object.InvoiceTypeCode = InvoiceTypes[i].Code;
				this_object.InvoiceTypeErpCode = InvoiceTypes[i].ErpCode;
				this_object.InvoiceTypeName = InvoiceTypes[i].Name;
				break;
			}
		}
	});

	// 提交表单
	$("#CustomerCorporationInfos_form").validate({
		rules:{
			CustomerCorporationInfos_CorporationName: {
				required:true
			},
			CustomerCorporationInfos_LedgerAccountName: {
				required:true
			},
			CustomerCorporationInfos_PaymentTermName: {
				required:true
			},
			CustomerCorporationInfos_InvoiceTypeName: {
				required:true
			},
			CustomerCorporationInfos_InvoiceReceiver: {
				required:true
			},
			CustomerCorporationInfos_InvoiceReceiverTele: {
				required:true, minlength:8
			}
		},
		messages:{
			CustomerCorporationInfos_CorporationName: {
				required:"请选择公司"
			},
			CustomerCorporationInfos_LedgerAccountName: {
				required:"请选择科目"
			},
			CustomerCorporationInfos_PaymentTermName: {
				required:"请选择支付条款"
			},
			CustomerCorporationInfos_InvoiceTypeName: {
				required:"请选择开票类型"
			},
			CustomerCorporationInfos_InvoiceReceiver: {
				required:"请输入收件人"
			},
			CustomerCorporationInfos_InvoiceReceiverTele: {
				required:"请输入电话", minlength:"电话最少8位"
			}
		},
		submitHandler: function() {
			this_object.InvoiceReceiver = $("#CustomerCorporationInfos_InvoiceReceiver").val();
			this_object.InvoiceReceiverTele = $("#CustomerCorporationInfos_InvoiceReceiverTele").val();
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				this_object.IsFreezed = 0;
				$("#CustomerCorporationInfos_table").jqGrid("addRowData", $("#CustomerExpectedSales_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerCorporationInfos.push(this_object);
			} else {
				$("#CustomerCorporationInfos_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerCorporationInfos) {
		 	    	if (CustomerCorporationInfos[i].Id == this_object.Id) {
		 	    		CustomerCorporationInfos[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerCorporationInfos = true;
			$("#CustomerCorporationInfos_table").trigger("reloadGrid");
			$("#CustomerCorporationInfosPop").fadeOut(100);
		},
		highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerCorporationInfos_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerCorporationInfos_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerCorporationInfos) {
 	    	if (CustomerCorporationInfos[i].Id == Id) {
 	    		this_object = $.extend(true, {}, CustomerCorporationInfos[i]);;
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    // 权限检查
 	    if (User_corporations != "admin" && User_corporations.indexOf(this_object.CorporationId) == -1) {
 	    	swalMsg("", "您没有该公司的操作权限", "error");
 	    	return;
 	    }
 	    clickWay = "CustomerCorporationInfosClick";
 	    $("#CustomerCorporationInfosPop").find("dl").find("input").val("");

 	    $("#CustomerCorporationInfos_CorporationName").val(this_object.CorporationId + "-" + this_object.CorporationName);
 	    $("#CustomerCorporationInfos_LedgerAccountName").val(this_object.LedgerAccountName);
 	    $("#CustomerCorporationInfos_PaymentTermName").val(this_object.PaymentTermName);
 	    $("#CustomerCorporationInfos_InvoiceTypeName").val(this_object.InvoiceTypeName);
 	    $("#CustomerCorporationInfos_InvoiceReceiver").val(this_object.InvoiceReceiver);
		$("#CustomerCorporationInfos_InvoiceReceiverTele").val(this_object.InvoiceReceiverTele);
		$("#CustomerCorporationInfosPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerCorporationInfos_del").click(function() {
		delJqgridCols("CustomerCorporationInfos_table", CustomerCorporationInfos);
	});

	// 冻结
	$("#CustomerCorporationInfos_freeze").click(function() {
		freezeJqgridCols("CustomerCorporationInfos_table", CustomerCorporationInfos);
	});

	// 解冻
	$("#CustomerCorporationInfos_unfreeze").click(function() {
		unfreezeJqgridCols("CustomerCorporationInfos_table", CustomerCorporationInfos);
	});

	/***************************************销售信息*********************************************/
	$("#CustomerSalesInfos_add").click(function() {
		$("#CustomerSalesInfosPop").find("dl").find("input").val("");
		clickWay = "CustomerSalesInfosClick";
		this_object = {};
		if (CustomerCorporationInfos == null || CustomerCorporationInfos.length == 0) {
			swalMsg("", "请先添加公司信息", "warning");
			return;
		}
		// 每次重新请求销售范围
		getSalesDistributeRanges("");
		// 支付条款
		if (PaymentTerms == null) {
			getPaymentTerms("");
		} else {
			this_object.PaymentTermId = PaymentTerms[0].Id;
			this_object.PaymentTermName = PaymentTerms[0].Name;
			$("#CustomerSalesInfos_PaymentTermName").val(PaymentTerms[0].Id + "-" + PaymentTerms[0].Name);
		}
		// 客户组
		if (CustomerGroups === null) {
			getCustomerGroups("");
		} else {
			this_object.CustomerGroupId = CustomerGroups[0].Id;
			this_object.CustomerGroupName = CustomerGroups[0].Name;
			$("#CustomerSalesInfos_CustomerGroupName").val(CustomerGroups[0].Id + "-" + CustomerGroups[0].Name);
		}
		// 账户分配组
		if (AccountAssignGroups === null) {
			getAccountAssignGroups("");
		} else {
			this_object.AccountAssignGroupId = AccountAssignGroups[0].Id;
			this_object.AccountAssignGroupName = AccountAssignGroups[0].Name;
			$("#CustomerSalesInfos_AccountAssignGroupName").val(AccountAssignGroups[0].Id + "-" + AccountAssignGroups[0].Name);
		}
		// 销售区域
		if (SalesAreas === null) {
			getSalesAreas("");
		} else {
			this_object.SalesAreaId = SalesAreas[0].Id;
			this_object.SalesAreaName = SalesAreas[0].Name;
			$("#CustomerSalesInfos_SalesAreaName").val(SalesAreas[0].Id + "-" + SalesAreas[0].Name);
		}
		CustomerSalesInfosSalesOffices = null;
		$("#CustomerSalesInfosPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击选择支付条款
	$("#CustomerSalesInfos_PaymentTermName").click(function() {
		if (PaymentTerms === null) {
			getPaymentTerms("CustomerSalesInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_PaymentTerms"));
		}
	});


	// 点击客户组
	$("#CustomerSalesInfos_CustomerGroupName").click(function() {
		if (CustomerGroups === null) {
			getCustomerGroups("CustomerSalesInfosClick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择客户组
	$("#CustomerSalesInfos_CustomerGroupName").parent("label").on("click", ".ulinput li", function() {
		var CustomerGroupId = $(this).attr("CustomerGroupId");
		if (CustomerGroupId == this_object.CustomerGroupId) {
			return;
		}
		for (var i = 0; i < CustomerGroups.length; i++) {
			if (CustomerGroupId == CustomerGroups[i].Id) {
				this_object.CustomerGroupId = CustomerGroups[i].Id;
				this_object.CustomerGroupName = CustomerGroups[i].Name;
				return;
			}
		}
	});

	// 点击账户分配组
	$("#CustomerSalesInfos_AccountAssignGroupName").click(function() {
		if (AccountAssignGroups === null) {
			getAccountAssignGroups("CustomerSalesInfosClick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择账户分配组
	$("#CustomerSalesInfos_AccountAssignGroupName").parent("label").on("click", ".ulinput li", function() {
		// 2019-07-10 cc #IYZZT  old CustomerGroupId
		var AccountAssignGroupId = $(this).attr("AccountAssignGroupId");
		if (AccountAssignGroupId == this_object.AccountAssignGroupId) {
			return;
		}
		for (var i = 0; i < AccountAssignGroups.length; i++) {
			if (AccountAssignGroupId == AccountAssignGroups[i].Id) {
				this_object.AccountAssignGroupId = AccountAssignGroups[i].Id;
				this_object.AccountAssignGroupName = AccountAssignGroups[i].Name;
				return;
			}
		}
	});

	// 点击销售区域
	$("#CustomerSalesInfos_SalesAreaName").click(function() {
		if (SalesAreas === null) {
			getSalesAreas("CustomerSalesInfosClick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择销售区域
	$("#CustomerSalesInfos_SalesAreaName").parent("label").on("click", ".ulinput li", function() {
		var SalesAreaId = $(this).attr("SalesAreaId");
		if (SalesAreaId == this_object.SalesAreaId) {
			return;
		}
		for (var i = 0; i < SalesAreas.length; i++) {
			if (SalesAreaId == SalesAreas[i].Id) {
				this_object.SalesAreaId = SalesAreas[i].Id;
				this_object.SalesAreaName = SalesAreas[i].Name;
				break;
			}
		}
	});

	// 点击选择销售范围
	$("#CustomerSalesInfos_SalesDistributeRangeName").click(function() {
		if (SalesDistributeRanges === null) {
			getSalesDistributeRanges("CustomerSalesInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_SalesDistributeRanges"));
		}
	});

	// 点击工厂
	$("#CustomerSalesInfos_FactoryName").click(function() {
		if (CustomerSalesInfosFactories === null) {
			getCustomerSalesInfosFactories("CustomerSalesInfosClick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择工厂
	$("#CustomerSalesInfos_FactoryName").parent("label").on("click", ".ulinput li", function() {
		var FactoryId = $(this).attr("FactoryId");
		if (FactoryId == this_object.FactoryId) {
			return;
		}
		for (var i = 0; i < CustomerSalesInfosFactories.length; i++) {
			if (FactoryId == CustomerSalesInfosFactories[i].Id) {
				this_object.FactoryId = CustomerSalesInfosFactories[i].Id;
				this_object.FactoryName = CustomerSalesInfosFactories[i].Name;
				break;
			}
		}
	});

	// 点击选择销售办公室
	$("#CustomerSalesInfos_SalesOfficeName").click(function() {
		if (CustomerSalesInfosSalesOffices === null) {
			getCustomerSalesInfosSalesOffices("CustomerSalesInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_SalesOffices"));
		}
	});

	// 点击考核片区
	$("#CustomerSalesInfos_AppraisalZoneName").click(function() {
		if (AppraisalZones == null) {
			loadAppraisalZones("click");
		} else {
			$("#AppraisalZones_tree").fadeIn(0);
		}
	});

	// 展开树
	$("#AppraisalZones_tree .organization_portion").on("click", "li i", function() {
		$(this).siblings("ul").slideToggle(100);
	});

	// 选择管理机构
	$("#AppraisalZones_tree .organization_portion").on("click", "li span", function() {
		this_object.AppraisalZoneId = $(this).attr("organizationId");
		this_object.AppraisalZoneCode = $(this).attr("organizationCode");
		this_object.AppraisalZoneName = $(this).attr("organizationName");
		this_object.AppraisalZoneNames = $(this).attr("organizationNames");
		$("#CustomerSalesInfos_AppraisalZoneName").val(this_object.AppraisalZoneName);
		$("#AppraisalZones_tree").fadeOut(0);
	});


	// 提交
	$("#CustomerSalesInfos_form").validate({
		rules:{
			CustomerSalesInfos_PaymentTermName: {
				required:true
			},
			CustomerSalesInfos_CustomerGroupName: {
				required:true
			},
			CustomerSalesInfos_AccountAssignGroupName: {
				required:true
			},
			CustomerSalesInfos_SalesAreaName: {
				required:true
			},
			CustomerSalesInfos_SalesDistributeRangeName: {
				required:true
			},
			CustomerSalesInfos_FactoryName: {
				required:true
			},
			CustomerSalesInfos_SalesOfficeName: {
				required:true
			},
			CustomerSalesInfos_AppraisalZoneName: {
				required:true
			}
		},
		messages:{
			CustomerSalesInfos_PaymentTermName: {
				required:"请选择公司"
			},
			CustomerSalesInfos_CustomerGroupName: {
				required:"请选择科目"
			},
			CustomerSalesInfos_AccountAssignGroupName: {
				required:"请选择支付条款"
			},
			CustomerSalesInfos_SalesAreaName: {
				required:"请选择开票类型"
			},
			CustomerSalesInfos_SalesDistributeRangeName: {
				required:"请输入收件人"
			},
			CustomerSalesInfos_FactoryName: {
				required:"请选择工厂"
			},
			CustomerSalesInfos_SalesOfficeName: {
				required:"请选择办公室"
			},
			CustomerSalesInfos_AppraisalZoneName: {
				required:"请选择片区"
			}
		},
		submitHandler: function() {
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				this_object.IsFreezed = 0;
				$("#CustomerSalesInfos_table").jqGrid("addRowData", $("#CustomerSalesInfos_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerSalesInfos.push(this_object);
			} else {
				$("#CustomerSalesInfos_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerSalesInfos) {
		 	    	if (CustomerSalesInfos[i].Id == this_object.Id) {
		 	    		CustomerSalesInfos[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerSalesInfos = true;
			$("#CustomerSalesInfos_table").trigger("reloadGrid");
			$("#CustomerSalesInfosPop").fadeOut(100);
		}, highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerSalesInfos_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerSalesInfos_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerSalesInfos) {
 	    	if (CustomerSalesInfos[i].Id == Id) {
 	    		this_object = $.extend(true, {}, CustomerSalesInfos[i]);;
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    // 权限检查
 	    if (User_corporations != "admin" && User_corporations.indexOf(this_object.SalesOrganizationId) == -1) {
 	    	swalMsg("", "您没有该公司的操作权限", "error");
 	    	return;
 	    }
 	    clickWay = "CustomerSalesInfosClick";
 	    $("#CustomerSalesInfosPop").find("dl").find("input").val("");
 	    CustomerSalesInfosSalesOffices = null;

 	    $("#CustomerSalesInfos_PaymentTermName").val(this_object.PaymentTermId + "-" + this_object.PaymentTermName);
 	    $("#CustomerSalesInfos_CustomerGroupName").val(this_object.CustomerGroupId + "-" + this_object.CustomerGroupName);
 	    $("#CustomerSalesInfos_AccountAssignGroupName").val(this_object.AccountAssignGroupId + "-" + this_object.AccountAssignGroupName);
 	    $("#CustomerSalesInfos_SalesAreaName").val(this_object.SalesAreaId + "-" + this_object.SalesAreaName);
 	    $("#CustomerSalesInfos_SalesDistributeRangeName").val(this_object.SalesDistributeRangeId + "-" + this_object.SalesDistributeRangeName);
 	    $("#CustomerSalesInfos_FactoryName").val(this_object.FactoryId + "-" + this_object.FactoryName);
 	    $("#CustomerSalesInfos_SalesOfficeName").val(this_object.SalesOfficeId + "-" + this_object.SalesOfficeName);
 	    $("#CustomerSalesInfos_AppraisalZoneName").val(this_object.AppraisalZoneName);
		$("#CustomerSalesInfosPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerSalesInfos_del").click(function() {
		delJqgridCols("CustomerSalesInfos_table", CustomerSalesInfos);
	});

	// 冻结
	$("#CustomerSalesInfos_freeze").click(function() {
		freezeJqgridCols("CustomerSalesInfos_table", CustomerSalesInfos);
	});

	// 解冻
	$("#CustomerSalesInfos_unfreeze").click(function() {
		unfreezeJqgridCols("CustomerSalesInfos_table", CustomerSalesInfos);
	});

	/******************************************合作伙伴信息************************************************/
	$("#CustomerPartnerInfos_add").click(function() {
		$("#CustomerPartnerInfosPop").find("dl").find("input").val("");
		clickWay = "CustomerPartnerInfosClick";
		this_object = {};
		Partners = null;
		if (CustomerCorporationInfos == null || CustomerCorporationInfos.length == 0) {
			swalMsg("", "请先添加公司信息", "warning");
			return;
		}
		// 每次重新获取销售范围
		getSalesDistributeRanges("");
		if (PartnerFunctions === null) {
			getPartnerFunctions("");
		} else {
			$("#CustomerPartnerInfos_PartnerFunctionName").val(PartnerFunctions[0].Id + "-" + PartnerFunctions[0].Name);
			this_object.PartnerFunctionId = PartnerFunctions[0].Id;
			this_object.PartnerFunctionName = PartnerFunctions[0].Name;
		}
		$("#CustomerPartnerInfosPop").fadeIn(100);
		add_edit_type = "add";
	});

	// 点击合作伙伴功能
	$("#CustomerPartnerInfos_PartnerFunctionName").click(function() {
		if (PartnerFunctions === null) {
			getPartnerFunctions("CustomerPartnerInfosClick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择合作伙伴功能
	$("#CustomerPartnerInfos_PartnerFunctionName").parent("label").on("click", ".ulinput li", function() {
		var PartnerFunctionId = $(this).attr("PartnerFunctionId");
		if (PartnerFunctionId == this_object.PartnerFunctionId) {
			return;
		}
		for (var i = 0; i < PartnerFunctions.length; i++) {
			if (PartnerFunctionId == PartnerFunctions[i].Id) {
				this_object.PartnerFunctionId = PartnerFunctions[i].Id;
				this_object.PartnerFunctionName = PartnerFunctions[i].Name;
				break;
			}
		}
	});

	// 点击选择销售范围
	$("#CustomerPartnerInfos_SalesDistributeRangeName").click(function() {
		if (SalesDistributeRanges === null) {
			getSalesDistributeRanges("CustomerPartnerInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_SalesDistributeRanges"));
		}
	});

	// 点击选择合作伙伴
	$("#CustomerPartnerInfos_PartnerName").click(function() {
		if (Partners === null) {
			getPartners("CustomerPartnerInfosClick");
		} else {
			dropGridOnlyShow($(this), $("#input_jqgrid_Partners"));
		}
	});

	// 提交表单
	$("#CustomerPartnerInfos_form").validate({
		rules:{
			CustomerPartnerInfos_PartnerFunctionName: {
				required:true
			},
			CustomerPartnerInfos_SalesDistributeRangeName: {
				required:true
			},
			CustomerPartnerInfos_PartnerName: {
				required:true
			}
		},
		messages:{
			CustomerPartnerInfos_PartnerFunctionName: {
				required:"请选择功能"
			},
			CustomerPartnerInfos_SalesDistributeRangeName: {
				required:"请选择销售范围"
			},
			CustomerPartnerInfos_PartnerName: {
				required:"请选择合作伙伴"
			}
		},
		submitHandler: function() {
			if (this_object.PartnerFunctionId == "ZS") {
				for (var i in CustomerPartnerInfos) {
					if(!CustomerPartnerInfos[i].IsFreezed){
						if (CustomerPartnerInfos[i].SalesDistributeRangeId == this_object.SalesDistributeRangeId) {
							if (CustomerPartnerInfos[i].PartnerFunctionId == "ZS" && CustomerPartnerInfos[i].Id != this_object.Id) {
								swalMsg("", "同销售范围下已维护考核方！", "warning");
								return;
							}
						}
					}
				}
			} else {
				for (var i in CustomerPartnerInfos) {
					if (this_object.PartnerFunctionId == CustomerPartnerInfos[i].PartnerFunctionId && CustomerPartnerInfos[i].SalesDistributeRangeId == this_object.SalesDistributeRangeId) {
						if (CustomerPartnerInfos[i].PartnerId == this_object.PartnerId) {
							swalMsg("", "请勿重复添加合作伙伴", "warning");
							return;
						}
					}
				}
			}
			if (add_edit_type == "add") {
				this_object.Id = getUUID();
				this_object.HeadsId = this_HeadsId;
				this_object.IsFreezed = 0;
				$("#CustomerPartnerInfos_table").jqGrid("addRowData", $("#CustomerPartnerInfos_table").jqGrid('getDataIDs') + 1, this_object, "last");
				CustomerPartnerInfos.push(this_object);
			} else {
				$("#CustomerPartnerInfos_table").setRowData(this_object.Id, this_object);
		 	    for (var i in CustomerPartnerInfos) {
		 	    	if (CustomerPartnerInfos[i].Id == this_object.Id) {
		 	    		CustomerPartnerInfos[i] = $.extend(true, {}, this_object);
		 	    		break;
		 	    	}
		 	    }
			}
			isupded.CustomerPartnerInfos = true;
			$("#CustomerPartnerInfos_table").trigger("reloadGrid");
			$("#CustomerPartnerInfosPop").fadeOut(100);
		},
		highlight: function(element, errorClass) {
			$(element).parent().parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 编辑
	$("#CustomerPartnerInfos_edit").click(function() {
		this_object = null;
		var Id = $("#CustomerPartnerInfos_table").jqGrid("getGridParam", "selrow");
		if (Id === null) {
			swalMsg("", "请选择其中一条记录编辑", "error");
			return;
		}
 	    for (var i in CustomerPartnerInfos) {
 	    	if (CustomerPartnerInfos[i].Id == Id) {
 	    		this_object = $.extend(true, {}, CustomerPartnerInfos[i]);;
 	    		break;
 	    	}
 	    }
 	    if (this_object == null) {
 	    	illegalChangeOrMemoryError();
 	    	return;
 	    }
 	    // 权限检查
 	    if (User_corporations != "admin" && User_corporations.indexOf(this_object.SalesDistributeRangeId.substr(0, 4)) == -1) {
 	    	swalMsg("", "您没有该公司的操作权限", "error");
 	    	return;
 	    }
 	    clickWay = "CustomerPartnerInfosClick";
 	    $("#CustomerPartnerInfosPop").find("dl").find("input").val("");

 	    $("#CustomerPartnerInfos_PartnerFunctionName").val(this_object.PartnerFunctionId + "-" + this_object.PartnerFunctionName);
 	    $("#CustomerPartnerInfos_SalesDistributeRangeName").val(this_object.SalesDistributeRangeId + "-" + this_object.SalesDistributeRangeName);
 	    $("#CustomerPartnerInfos_PartnerName").val(this_object.PartnerName);
 	    $("#CustomerPartnerInfos_PartnerErpCode").val(this_object.PartnerErpCode);
		$("#CustomerPartnerInfosPop").fadeIn(100);
		add_edit_type = "edit";
	});

	// 删除
	$("#CustomerPartnerInfos_del").click(function() {
		delJqgridCols("CustomerPartnerInfos_table", CustomerPartnerInfos);
	});

	// 冻结
	$("#CustomerPartnerInfos_freeze").click(function() {
		freezeJqgridCols("CustomerPartnerInfos_table", CustomerPartnerInfos);
	});

	// 解冻
	$("#CustomerPartnerInfos_unfreeze").click(function() {
		unfreezeJqgridCols("CustomerPartnerInfos_table", CustomerPartnerInfos);
	});


	/********************************************************基础信息*******************************************************/
	// 提交
	$("#CustomerHeads_form").validate({
		rules:{
			Name: {required:true},
			CustomerTypeName: {required:true},
			CustomerAccountGroupName: {required:true},
			Nature: {required:true},
			CompanyKindName: {required:true},
			TradeName: {required:true},
			AppraisalRegionName: {required:true},
			AppraisalCityName: {required:true},
			RegionName: {required:true},
			LegalPerson: {required:true},
			LegalPersonIdCard: {required:true, minlength: 15},
			Address: {required:true},
			Telephone: {required:true, minlength: 8},
			Email: {email:true},
			PostalCode: {required:true,minlength:6,maxlength:6},
			OrganizationName: {required:true},
			Caption: {required:true}
		},
		messages:{
			Name: {required:"名称为必填项"},
			CustomerTypeName: {required:"客户类型为必填项"},
			CustomerAccountGroupName: {required:"客户账户组为必填项"},
			Nature: {required:"客户性质为必填项"},
			CompanyKindName: {required:"企业性质为必填项"},
			TradeName: {required:"所属行业为必填项"},
			AppraisalRegionName: {required:"考核省区为必填项"},
			AppraisalCityName: {required:"考核城市为必填项"},
			RegionName: {required:"注册区域为必填项"},
			LegalPerson: {required:"法人代表为必填项"},
			LegalPersonIdCard: {required:"法人身份证号为必填项", minlength : "身份证号最少15位"},
			Address: {required:"办公地址为必填项"},
			Telephone: {required:"联系电话为必填项", minlength : "电话号码最少8位"},
			Email: {email:"请输入正确的邮箱"},
			PostalCode: {required:"邮政编码为必填项",minlength:"邮政编码为6位",maxlength:"邮政编码为6位"},
			OrganizationName: {required:"申请单位为必填项"},
			Caption: {required:"申请说明为必填项"}
		}, errorPlacement: function(error, element) {
		  if ( element.is(":radio") )
			error.appendTo( element.parent().next());
		  else if ( element.is(":checkbox") )
			error.appendTo ( element.next());
		  else
			error.appendTo( element.parent());
		},submitHandler: function() {
		},success: function(label) {
		  label.html(" ").addClass("checked");
		},highlight: function(element, errorClass) {
		  $(element).parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 开票信息
	$("#CustomerHeadsInvoice_form").validate({
		rules:{
			InvoiceTypeName: {required:true},
			InvoiceReceiver: {required:true},
			InvoiceReceiverTele: {minlength: 8},
			InvoiceMailAddress: {required:true},
			InvoiceTele: {minlength: 8}
		},
		messages:{
			InvoiceTypeName: {required:"开票类型必填"},
			InvoiceReceiver: {required:"发票收件人必填"},
			InvoiceReceiverTele: {minlength:"电话最少8位"},
			InvoiceMailAddress: {required:"邮寄地址必填"},
			InvoiceTele: {minlength : "电话最少8位"}
		}, errorPlacement: function(error, element) {
			if ( element.is(":radio") )
				error.appendTo( element.parent().next());
			else if ( element.is(":checkbox") )
				error.appendTo ( element.next());
			else
				error.appendTo( element.parent());
		},submitHandler: function() {
		},success: function(label) {
			label.html(" ").addClass("checked");
		},highlight: function(element, errorClass) {
			$(element).parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 一次性客户发票
	$("#oneCustomerHeadsInvoice_form").validate({
		rules:{
			InvoiceReceiverTele: {minlength: 8},
			InvoiceTele: {minlength: 8}
		},
		messages:{
			InvoiceReceiverTele: {minlength:"电话最少8位"},
			InvoiceTele: {minlength : "电话最少8位"}
		}, errorPlacement: function(error, element) {
			if ( element.is(":radio") )
				error.appendTo( element.parent().next());
			else if ( element.is(":checkbox") )
				error.appendTo ( element.next());
			else
				error.appendTo( element.parent());
		},submitHandler: function() {
		},success: function(label) {
			label.html(" ").addClass("checked");
		},highlight: function(element, errorClass) {
			$(element).parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 一次性客户发票
	$("#CustomerAbility_form").validate({
		rules:{
			AnnualSales: {digits:true},
			AnnualSpiritSales: {digits:true},
			WorkingFund: {digits:true},
			SalesRank: {digits:true},
			NumberOfEmployee: {digits:true},
			NumberOfSalesman: {digits:true},
			NumberOfPlaner: {digits:true},
			NumberOfManager: {digits:true},
			NumberOfServeman: {digits:true},
			NumberOfVehicle: {digits:true},
			NumberOfChar: {digits:true},
			StoreArea: {digits:true},
			OfficeArea: {digits:true},
			SpecialMoney: {digits:true}
		},
		messages:{
			AnnualSales: {digits:"只能输入正整数"},
			AnnualSpiritSales: {digits:"只能输入正整数"},
			WorkingFund: {digits:"只能输入正整数"},
			SalesRank: {digits:"只能输入正整数"},
			NumberOfEmployee: {digits:"只能输入正整数"},
			NumberOfSalesman: {digits:"只能输入正整数"},
			NumberOfPlaner: {digits:"只能输入正整数"},
			NumberOfManager: {digits:"只能输入正整数"},
			NumberOfServeman: {digits:"只能输入正整数"},
			NumberOfVehicle: {digits:"只能输入正整数"},
			NumberOfChar: {digits:"只能输入正整数"},
			StoreArea: {digits:"只能输入正整数"},
			OfficeArea: {digits:"只能输入正整数"},
			SpecialMoney: {digits:"只能输入正整数"}
		}, errorPlacement: function(error, element) {
			if ( element.is(":radio") )
				error.appendTo( element.parent().next());
			else if ( element.is(":checkbox") )
				error.appendTo ( element.next());
			else
				error.appendTo( element.parent());
		},submitHandler: function() {
		},success: function(label) {
			label.html(" ").addClass("checked");
		},highlight: function(element, errorClass) {
			$(element).parent().next().find("." + errorClass).removeClass("checked");
		}
	});

	// 点击客户类型
	$("#CustomerTypeName").click(function() {
		if (CustomerTypes === null) {
			getCustomerTypes("click");
		} else {
			 selOnlyShow($(this));
		}
	});

	// 选择客户类型
	$("#CustomerTypeName").parent("label").on("click", ".ulinput li", function() {
		var CustomerTypeId = $(this).attr("CustomerTypeId");
		if (CustomerTypeId == CustomerHeads.CustomerTypeId) {
			return;
		}
		for (var i = 0; i < CustomerTypes.length; i++) {
			if (CustomerTypeId == CustomerTypes[i].Id) {
				CustomerHeads.CustomerTypeId = CustomerTypes[i].Id;
				CustomerHeads.IsOneTime = CustomerTypes[i].IsOnce;
				CustomerHeads.CanSendToERP = CustomerTypes[i].CanSendToERP;
				CustomerHeads.CustomerTypeCode = CustomerTypes[i].Code;
				CustomerHeads.CustomerTypeName = CustomerTypes[i].Name;
				if (CustomerHeads.IsOneTime) {
					$("#CustomerCorporationInfos_panel").attr("class", "notAllow");
					$("#CustomerSalesInfos_panel").attr("class", "notAllow");
					$("#CustomerPartnerInfos_panel").attr("class", "notAllow");
				} else {
					$("#CustomerCorporationInfos_panel").removeClass("notAllow");
					$("#CustomerSalesInfos_panel").removeClass("notAllow");
					$("#CustomerPartnerInfos_panel").removeClass("notAllow");
				}
				if (CustomerHeads.CustomerTypeCode == "qt") {
					$(".qtType").hide();
					$("#qtTypeAppraisalRegionName").html("所在省区");
					$("#qtTypeAppraisalCityName").html("所在城市");
					$(".CustomerSalesInfos_AppraisalZoneName").find("i").hide();
					$("#CustomerSalesInfos_AppraisalZoneName").removeAttr("name");
					//LegalPersonIdCard 非必填
					// 2019-06-25  cc
					$(".dtLegalPersonIdCard").find("i").hide();
			        $("#LegalPersonIdCard").rules("remove");
				} else {
					$(".qtType").show();
					$("#qtTypeAppraisalRegionName").html("考核省区");
					$("#qtTypeAppraisalCityName").html("考核城市");
					$(".CustomerSalesInfos_AppraisalZoneName").find("i").show();
					$("#CustomerSalesInfos_AppraisalZoneName").attr("name", "CustomerSalesInfos_AppraisalZoneName");
					$(".dtLegalPersonIdCard").find("i").show();
					// 2019-06-25  cc
			        $("#LegalPersonIdCard").rules("add",{required:true,minlength:15,messages:{required:"法人身份证号为必填项", minlength : "身份证号最少15位"}});
				}
				break;
			}
		}
	});

	// 点击客户账户组
	$("#CustomerAccountGroupName").click(function() {
		if (CustomerAccountGroups === null) {
			getCustomerAccountGroups("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择客户账户组
	$("#CustomerAccountGroupName").parent("label").on("click", ".ulinput li", function() {
		var CustomerAccountGroupId = $(this).attr("CustomerAccountGroupId");
		if (CustomerAccountGroupId == CustomerHeads.CustomerAccountGroupId) {
			// 处理 老客户资料信息缺失问题
			for (var i = 0; i < CustomerAccountGroups.length; i++) {
				if (CustomerAccountGroupId == CustomerAccountGroups[i].Id) {
					CustomerHeads.CustomerAccountGroupId = CustomerAccountGroups[i].Id;
					CustomerHeads.LedgerAccounts = CustomerAccountGroups[i].LedgerAccounts;
					CustomerHeads.CustomerAccountGroupCode = CustomerAccountGroups[i].Code;
					CustomerHeads.CustomerAccountGroupName = CustomerAccountGroups[i].Name;
					break;
				}
			}
			return;
		}
		for (var i = 0; i < CustomerAccountGroups.length; i++) {
			if (CustomerAccountGroupId == CustomerAccountGroups[i].Id) {
				for (var j in CustomerCorporationInfos) {
					if (CustomerCorporationInfos[j].LedgerAccountId != CustomerAccountGroups[i].LedgerAccounts) {
						swal({
							title: "",
				            text: "公司信息中包含非'" + CustomerAccountGroups[i].Name + "'对应的统驭科目，您确定要修改吗？",
				            type: "warning",
				            showCancelButton: true,
				            confirmButtonColor: "#DD6B55",
				            confirmButtonText: "确定",
				            cancelButtonText: "取消",
				            closeOnConfirm: true,
				            closeOnCancel: true
				        }, function(isConfirm) {
				            if (isConfirm) {
				            	CustomerHeads.CustomerAccountGroupId = CustomerAccountGroups[i].Id;
								CustomerHeads.LedgerAccounts = CustomerAccountGroups[i].LedgerAccounts;
								CustomerHeads.CustomerAccountGroupCode = CustomerAccountGroups[i].Code;
								CustomerHeads.CustomerAccountGroupName = CustomerAccountGroups[i].Name;
								// 换客户组清空统驭科目
								LedgerAccounts = null;
				            } else {
				            	$("#CustomerAccountGroupName").val(CustomerHeads.CustomerAccountGroupCode + "-" + CustomerHeads.CustomerAccountGroupName);
				            }
				        });
						return;
					}
				}
				CustomerHeads.CustomerAccountGroupId = CustomerAccountGroups[i].Id;
				CustomerHeads.LedgerAccounts = CustomerAccountGroups[i].LedgerAccounts;
				CustomerHeads.CustomerAccountGroupCode = CustomerAccountGroups[i].Code;
				CustomerHeads.CustomerAccountGroupName = CustomerAccountGroups[i].Name;
				// 换客户组清空统驭科目
				LedgerAccounts = null;
				return;
			}
		}
	});

	// 点击考核省区
	$("#AppraisalRegionName").click(function() {
		if (AppraisalRegions === null) {
			getAppraisalRegions("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择考核省区
	$("#AppraisalRegionName").parent("label").on("click", ".ulinput li", function() {
		var AppraisalRegionId = $(this).attr("AppraisalRegionId");
		if (AppraisalRegionId == CustomerHeads.AppraisalRegionId) {
			return;
		}
		for (var i = 0; i < AppraisalRegions.length; i++) {
			if (AppraisalRegionId == AppraisalRegions[i].Id) {
				CustomerHeads.AppraisalRegionId = AppraisalRegions[i].Id;
				CustomerHeads.AppraisalRegionErpCode = AppraisalRegions[i].ErpCode;
				CustomerHeads.AppraisalRegionChineseStandard = AppraisalRegions[i].ChineseStandard;
				CustomerHeads.AppraisalRegionName = AppraisalRegions[i].Name;
				CustomerHeads.AppraisalCityErpCode = "";
				CustomerHeads.AppraisalCityChineseStandard = "";
				CustomerHeads.AppraisalCityName = "";
				$("#AppraisalCityName").val("");
				getAppraisalCities("");
				break;
			}
		}
	});

	// 点击考核城市
	$("#AppraisalCityName").click(function() {
		if (AppraisalCities === null) {
			getAppraisalCities("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择考核城市
	$("#AppraisalCityName").parent("label").on("click", ".ulinput li", function() {
		var AppraisalCityErpCode = $(this).attr("AppraisalCityErpCode");
		if (AppraisalCityErpCode == CustomerHeads.AppraisalCityErpCode) {
			return;
		}
		for (var i = 0; i < AppraisalCities.length; i++) {
			if (AppraisalCityErpCode == AppraisalCities[i].Id) {
				CustomerHeads.AppraisalCityErpCode = AppraisalCities[i].Id;
				CustomerHeads.AppraisalCityChineseStandard = AppraisalCities[i].ChineseStandard;
				CustomerHeads.AppraisalCityName = AppraisalCities[i].Name;
				break;
			}
		}
	});

	// 点击客户性质
	$("#Nature").click(function() {
		selOnlyShow($(this));
	});

	// 选择客户性质
	$("#Nature").parent("label").on("click", ".ulinput li", function() {
		CustomerHeads.Nature = $(this).text();
	});

	// 点击企业性质
	$("#CompanyKindName").click(function() {
		if (CompanyKinds === null) {
			getCompanyKinds("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择企业性质
	$("#CompanyKindName").parent("label").on("click", ".ulinput li", function() {
		var CompanyKindId = $(this).attr("CompanyKindId");
		if (CompanyKindId == CustomerHeads.CompanyKindId) {
			return;
		}
		for (var i = 0; i < CompanyKinds.length; i++) {
			if (CompanyKindId == CompanyKinds[i].Id) {
				CustomerHeads.CompanyKindId = CompanyKinds[i].Id;
				CustomerHeads.CompanyKindCode = CompanyKinds[i].Code;
				CustomerHeads.CompanyKindName = CompanyKinds[i].Name;
				break;
			}
		}
	});

	// 点击所属行业
	$("#TradeName").click(function() {
		if (Trades === null) {
			getTrades("click");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择所属行业
	$("#TradeName").parent("label").on("click", ".ulinput li", function() {
		var TradeId = $(this).attr("TradeId");
		if (TradeId == CustomerHeads.TradeId) {
			return;
		}
		for (var i = 0; i < Trades.length; i++) {
			if (TradeId == Trades[i].Id) {
				CustomerHeads.TradeId = Trades[i].Id;
				CustomerHeads.TradeCode = Trades[i].Code;
				CustomerHeads.TradeName = Trades[i].Name;
				break;
			}
		}
	});

	// 选择申请单位
	$("#OrganizationName").click(function() {
		organizationClickWay = "CustomerHeads";
		if (Organizations === null) {
			loadOrganizations("click");
		} else {
			$("#organization_tree").fadeIn(0);
		}
	});

	// 点击开票类型
	$("#InvoiceTypeName").click(function() {
		if (InvoiceTypes === null) {
			getInvoiceTypes("CustomerHeadsclick");
		} else {
			selOnlyShow($(this));
		}
	});

	// 选择开票类型
	$("#InvoiceTypeName").parent("label").on("click", ".ulinput li", function() {
		var InvoiceTypeId = $(this).attr("InvoiceTypeId");
		if (InvoiceTypeId == CustomerHeads.InvoiceTypeId) {
			return;
		}
		for (var i = 0; i < InvoiceTypes.length; i++) {
			if (InvoiceTypeId == InvoiceTypes[i].Id) {
				CustomerHeads.InvoiceTypeId = InvoiceTypes[i].Id;
				CustomerHeads.InvoiceTypeErpCode = InvoiceTypes[i].ErpCode;
				CustomerHeads.IsNeedTax = InvoiceTypes[i].IsNeedTax;
				CustomerHeads.InvoiceTypeName = InvoiceTypes[i].Name;
				if (CustomerHeads.IsNeedTax) {
					$(".NeedTax").show();
					$(".NoNeedTax").hide();
				} else {
					$(".NeedTax").hide();
					$(".NoNeedTax").show();
				}
				break;
			}
		}
	});

	// 点击客户优势，行销能力
	$("#CustomerSaleCapacity").click(function() {
		selOnlyShow($(this));
	});

	// 选择客户优势，行销能力
	$("#CustomerSaleCapacity").parent("label").on("click", ".ulinput li", function() {
		CustomerHeads.CustomerSaleCapacity = $(this).text();
	});

	// 点击管理能力
	$("#ManageCapacity").click(function() {
		selOnlyShow($(this));
	});

	// 选择管理能力
	$("#ManageCapacity").parent("label").on("click", ".ulinput li", function() {
		CustomerHeads.ManageCapacity = $(this).text();
	});

	// 点击是否经营老窖产品
	$("#IsSaleOurProduct").click(function() {
		selOnlyShow($(this));
	});

	// 选择是否经营老窖产品
	$("#IsSaleOurProduct").parent("label").on("click", ".ulinput li", function() {
		CustomerHeads.IsSaleOurProduct = $(this).text();
	});

	// 点击是否有亲友在本公司任职
	$("#IsHaveKithOrKin").click(function() {
		selOnlyShow($(this));
	});

	// 是否有亲友在本公司任职
	$("#IsHaveKithOrKin").parent("label").on("click", ".ulinput li", function() {
		CustomerHeads.IsHaveKithOrKin = $(this).text();
	});

	// 删除抬头附件
	$("#heads_file_upd").on("click", ".deleteFile", function() {
		var fileId = $(this).parent().attr("id");
		var i = 0;
		for (; i < Files.length; i++) {
			if (Files[i].Id == fileId) {
				break;
			}
		}
		swal({
			title: "",
            text: "您确定要删除吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function(isConfirm) {
            if (isConfirm) {
            	Files.splice(i, 1);
            	isupded.Files = true;
            	$("#heads_file_upd").find($(".uploadify-queue > div[id = '" + fileId + "']")).remove();
            }
        });
	});

	/**********************************************区域选择*************************************************/
	var region_sel = "";
	var RegionId = "";
	var RegionCode = "";
	var RegionCodes = "";
	var clickDiv = "";
	// 点击开始
	$("#RegionName").click(function() {
		firstRegionPart($(this));
		clickDiv = "RegionName";
	});

	// 收货信息选地址
	$("#CustomerDeliveryAddrs_RegionPath").click(function() {
		firstRegionPart($(this));
		clickDiv = "CustomerDeliveryAddrs_RegionPath";
	});

	// 开户预期选择
	$("#CustomerExpectedSales_SalesRegionName").click(function() {
		firstRegionPart($(this));
		clickDiv = "CustomerExpectedSales_SalesRegionName";
	});

	// 一次性客户选地址
	$("#one_RegionName").click(function() {
		firstRegionPart($(this));
		clickDiv = "one_RegionName";
	});

	// 第一级
	function firstRegionPart(_this) {
		region_sel = "";
		RegionId = "";
		RegionCode = "";
		if ($("#province_li").hasClass("citySel")) {
			region_sel = "中国/";
			RegionId = "1000/";
			RegionCode = "1000/";
		}
		$(".await").fadeIn(300);
		$.ajax({
          	type: "get",
          	url: "../share/getRegion/1000.html",
          	dataType: "json",
          	data: {},
       	  	success: function(data) {
       	  		$(".await").fadeOut(200);
          		var entry = data.message;
          		var htmls = "";
          		for (var i = 0; i < entry.length; i++) {
          			htmls += "<a data_son = '2' title = " + entry[i].Name + " RegionCode = " + entry[i].Code + " RegionId = " + entry[i].Id + ">" + entry[i].Name + "</a>";
          		}
          		$("#_citys0").html(htmls);
          		htmls = "";
      			htmls+="<a  title = '中国' RegionId = '1000'  RegionCode = '1000'>中国</a>";
      			htmls+="<a  title = '海外' RegionId = '2000'  RegionCode = '2000'>海外</a>";
      			$("#_citys_0").html(htmls);
      			var regiontop = $(_this).offset().top + $(_this).height() + 2;
      			var regionleft = $(_this).offset().left;
      			$(".region").css({"left": regionleft + "px", "top": regiontop + "px"});
      			$("#PoPy").show(0);
       	  	}, error: function() {
       	  		$(".await").fadeOut(200);
       	  		swalNetErrorMsg("区域信息");
       	  	}
	   	});
	}

	// 字符串处理函数，找到str中第num次出现cha的位置
	function findStrIndex(str, cha, num) {
	    var x = str.indexOf(cha);
	    for (var i = 0; i < num - 1; i++) {
	        x = str.indexOf(cha, x + 1);
	    }
	    return x;
    }

	// 截取出Id和Code
	function getRegionIdOrCode(str) {
		str = str.substr(str.lastIndexOf('/', str.lastIndexOf('/') - 1) + 1);
		return str.substr(0, str.length - 1);
	}

	//点击头部选择上一层
	$("._citys ._citys0 li").click(function() {
		var index = $(this).index();
		if (index === 0) {
			region_sel = "";
			RegionId = "";
			RegionCode = "";
		} else {
			region_sel = region_sel.substring(0, findStrIndex(region_sel, '/', index) + 1);
			RegionId = RegionId.substring(0, findStrIndex(RegionId, '/', index) + 1);
			RegionCode = RegionCode.substring(0, findStrIndex(RegionCode, '/', index) + 1);
		}
		if ($("._citys ._citys1:eq(" + $(this).index() + ") a").length > 0) {
			$(this).addClass("citySel").siblings().removeClass("citySel");
			$("._citys ._citys1:eq(" + $(this).index() + ")").show(0).siblings("._citys1").hide(0);
			$("._citys ._citys1:gt(" + $(this).index() + ")").html("");
		}
	});

	// 点击省市区A标签
	$("._citys  ._citys1").on("click", " a", function() {
		// 如果a标签里面的data_son下一级的数量大于0，那就继续展示下一级
		_this = $(this);
		_this.addClass("AreaS").siblings().removeClass("AreaS");
		$("._citys ._citys0 li:eq(" + ($(this).parent().index() - 1) + ")").addClass("citySel").siblings().removeClass("citySel");
		_this.parent("._citys1").next("._citys1").show(0).siblings("._citys1").hide(0);
		region_sel += _this.text() + "/";
		RegionId += _this.attr("RegionId") + "/";
		RegionCode += _this.attr("RegionCode") + "/";
		var ParentId = _this.attr("RegionId");
		$(".await").fadeIn(300);
		$.ajax({
          	type: "get",
          	url: "../share/getRegion/" + ParentId + ".html",
          	dataType: "json",
          	data: {
          	},
       	  	success:function(data) {
       	  		$(".await").fadeOut(200);
          		var entry = data.message;
          		var htmls = "";
          		if (clickDiv == "RegionName") {
          			$("#RegionName").val(region_sel);
          		} else if (clickDiv == "CustomerDeliveryAddrs_RegionPath") {
    				$("#CustomerDeliveryAddrs_RegionPath").val(region_sel);
    			} else if (clickDiv == "one_RegionName") {
    				$("#one_RegionName").val(region_sel);
    			} else if (clickDiv == "CustomerExpectedSales_SalesRegionName") {
    				$("#CustomerExpectedSales_SalesRegionName").val(region_sel);
    			}
          		if (entry.length < 1) {
          			$("._citys ._citys1:gt(1)").html("");
        			$("._citys ._citys1:eq(1)").show(0);
        			$("._citys ._citys0 li:eq(1)").addClass("citySel").siblings().removeClass("citySel");
        			$("#PoPy").hide(0);
        			if (clickDiv == "RegionName") {
        				CustomerHeads.RegionId = getRegionIdOrCode(RegionId);
        				CustomerHeads.RegionCodes = RegionCode;
        				CustomerHeads.RegionCode = getRegionIdOrCode(RegionCode);
        				CustomerHeads.RegionName = region_sel;
        			} else if (clickDiv == "CustomerDeliveryAddrs_RegionPath") {
        				this_object.RegionId = getRegionIdOrCode(RegionId);
        				this_object.RegionCode = getRegionIdOrCode(RegionCode);
    					this_object.RegionPath = region_sel;
        			} else if (clickDiv == "one_RegionName") {
        				CustomerHeads.RegionId = getRegionIdOrCode(RegionId);
        				CustomerHeads.RegionCodes = RegionCode;
        				CustomerHeads.RegionCode = getRegionIdOrCode(RegionCode);
        				CustomerHeads.RegionName = region_sel;
        			} else if (clickDiv == "CustomerExpectedSales_SalesRegionName") {
        				this_object.SalesRegionId = getRegionIdOrCode(RegionId);
        				this_object.SalesRegionCode = getRegionIdOrCode(RegionCode);
        				this_object.SalesRegionName = region_sel;
        			}
          			return;
          		}
          		for (var i = 0; i < entry.length; i++) {
          			htmls += "<a data_son = '2' title = " + entry[i].Name + " RegionCode = " + entry[i].Code + " RegionId = " + entry[i].Id + ">" + entry[i].Name + "</a>";
          		}
          		_this.parent("._citys1").next("._citys1").html(htmls);
       	  	}, error: function() {
       	  		$(".await").fadeOut(200);
       	  		swalNetErrorMsg("区域信息");
       	  	}
	   	});
	});

	// 关闭
	$("#region_sel_close").click(function() {
		$("._citys ._citys1:gt(1)").html("");
		$("._citys ._citys1:eq(1)").show(0);
		$("._citys ._citys1:gt(1)").hide(0);
		$("._citys ._citys0 li:eq(1)").addClass("citySel").siblings().removeClass("citySel");
		if (clickDiv == "RegionName") {
			$("#RegionName").val(region_sel);
			CustomerHeads.RegionId = getRegionIdOrCode(RegionId);
			CustomerHeads.RegionCodes = RegionCode;
			CustomerHeads.RegionCode = getRegionIdOrCode(RegionCode);
			CustomerHeads.RegionName = region_sel;
		} else if (clickDiv == "CustomerDeliveryAddrs_RegionPath") {
			$("#CustomerDeliveryAddrs_RegionPath").val(region_sel);
			this_object.RegionId = getRegionIdOrCode(RegionId);
			this_object.RegionCode = getRegionIdOrCode(RegionCode);
			this_object.RegionPath = region_sel;
		} else if (clickDiv == "one_RegionName") {
			$("#one_RegionName").val(region_sel);
			CustomerHeads.RegionId = getRegionIdOrCode(RegionId);
			CustomerHeads.RegionCodes = RegionCode;
			CustomerHeads.RegionCode = getRegionIdOrCode(RegionCode);
			CustomerHeads.RegionName = region_sel;
		} else if (clickDiv == "CustomerExpectedSales_SalesRegionName") {
			$("#CustomerExpectedSales_SalesRegionName").val(region_sel);
			this_object.SalesRegionId = getRegionIdOrCode(RegionId);
			this_object.SalesRegionCode = getRegionIdOrCode(RegionCode);
			this_object.SalesRegionName = region_sel;
		}
		$("#PoPy").hide(0);
	});




	/******************************************一次性客户*********************************************/

	// 点击客户类型
	$("#one_CustomerTypeName").click(function() {
		if (CustomerTypes === null) {
			getCustomerTypes("click");
		} else {
			 selOnlyShow($(this));
		}
	});

	// 选择客户类型
	$("#one_CustomerTypeName").parent("label").on("click", ".ulinput li", function() {
		var CustomerTypeId = $(this).attr("CustomerTypeId");
		if (CustomerTypeId == CustomerHeads.CustomerTypeId) {
			return;
		}
		for (var i = 0; i < CustomerTypes.length; i++) {
			if (CustomerTypeId == CustomerTypes[i].Id) {
				CustomerHeads.CustomerTypeId = CustomerTypes[i].Id;
				CustomerHeads.IsOneTime = CustomerTypes[i].IsOnce;
				CustomerHeads.CanSendToERP = CustomerTypes[i].CanSendToERP;
				CustomerHeads.CustomerTypeCode = CustomerTypes[i].Code;
				CustomerHeads.CustomerTypeName = CustomerTypes[i].Name;
				break;
			}
		}
	});

	// 加管理机构
	$("#one_CustomerOrganizations_add").click(function() {
		organizationClickWay = "one_CustomerOrganizations";
		this_object = {};
		if (Organizations === null) {
			loadOrganizations("click");
		} else {
			$("#organization_tree").fadeIn(0);
		}
	});

	$("#one_CustomerOrganizations_del").click(function() {
		delJqgridCols("one_CustomerOrganizations_table", CustomerOrganizations);
	});

	// 加载管理机构
	$("#one_CustomerOrganizations_panel").click(function() {
		if (!(page_action == "one" && action_type == "new")) {
			if (CustomerOrganizations == null) {
				loadCustomerOrganizations();
			}
		}
	});

	/******************非新增时加载详情数据*********************/

	// 业务联系人
	$("#CustomerLinkmans_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerLinkmans == null) {
				loadCustomerLinkmans();
			}
		}
	});


	// 送货信息
	$("#CustomerDeliveryAddrs_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerDeliveryAddrs == null) {
				loadCustomerDeliveryAddrs();
			}
		}
	});

	// 能力信息4张表
	$("#CustomerAbility_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (!ifGetAbilities) {
				loadCustomerAbilities();
			}
		}
	});

	// 开户预期销售信息
	$("#CustomerExpectedSales_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerExpectedSales == null) {
				loadCustomerExpectedSales();
			}
		}
	});

	// 管理机构
	$("#CustomerOrganizations_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerOrganizations == null) {
				loadCustomerOrganizations();
			}
		}
	});

	// 公司信息
	$("#CustomerCorporationInfos_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerCorporationInfos == null) {
				loadCustomerCorporationInfos();
			}
		}
	});
	// 销售信息
	$("#CustomerSalesInfos_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerSalesInfos == null) {
				loadCustomerSalesInfos();
			}
		}
	});

	// 合作伙伴信息
	$("#CustomerPartnerInfos_panel").click(function() {
		if (!(page_action == "new" && action_type == "new")) {
			if (CustomerPartnerInfos == null) {
				loadCustomerPartnerInfos();
			}
		}
	});

	// 返回首页
	$("#return_font_page").click(function() {
		if (page_action == "new") {
			window.location.href = "../cutomerRequestHeads/index.html";
		}
		if (page_action == "upd") {
			window.location.href = "../customerOldUpd/index.html";
		}
		if (page_action == "detail") {
			window.location.href = "../customerheads/index.html";
		}
		if (page_action == "one") {
			window.location.href = "../dispoableCustomer/index.html";
		}
	});

	// 关闭页面
	$("#close_flow_page").click(function() {
		if(IsPC()){
			window.opener = null;
			window.open('','_self');
			window.close();
		}else{
			window.history.back();
		}
	});

	function IsPC() {
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
	        "iPad", "iPod"];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	// 超管保存
	function managerSaveCustomer() {
		var submitData = {};
		submitData.action_type = action_type;
		submitData.page_action = page_action;
		var manager_param0 = [];
		for (var i in manager_CustomerCorporationInfos) {
			manager_param0.push(manager_CustomerCorporationInfos[i]);
		}
		submitData.CustomerCorporationInfos = $.extend(true, [], manager_param0);

		var manager_param1 = [];
		for (var i in manager_CustomerSalesInfos) {
			manager_param1.push(manager_CustomerSalesInfos[i]);
		}
		submitData.CustomerSalesInfos = $.extend(true, [], manager_param1);

		var manager_param2 = [];
		for (var i in manager_CustomerPartnerInfos) {
			manager_param2.push(manager_CustomerPartnerInfos[i]);
		}
		submitData.CustomerPartnerInfos = $.extend(true, [], manager_param2);
		submitData.isupded = isupded;
		// 超管便捷操作
		$(".await").show();
		$.ajax({
			type: "post",
			url: "../customers/updateCustomer.json",
			data: {jsonData : JSON.stringify(submitData)},
			dataType: "json",
			success: function(data) {
				$(".await").hide();
				if (data.success === true) {
					swal({
						title: "",
						timer: 3000,
						text: "修改成功",
						type: "success",
						confirmButtonText: "确定"
					}, function() {
						window.location.reload();
					});
				} else {
					swal({
						title: "",
						text: data.message,
						type: "error",
						confirmButtonColor: "#F27474",
						confirmButtonText: "确定"
					}, function() {
						window.location.reload();
					});
				}
			}, error: function() {
				$(".await").hide();
				swalMsg("", "网络连接失败，请重试或联系管理员", "error");
			}
		});
	}

	// 保存按钮
	$("#customer_save").click(function() {
		if (action_type == "manager_edit") {
			managerSaveCustomer();
		} else {
			var json = {};
			if (page_action == "one") {
				json.Name = $("#one_Name").val();
			} else {
				json.Name = $("#Name").val();
				json.ErpPackageCode = $("#ErpPackageCode").val();
			}
			if (!json.Name) {
				swalMsg("", "客户名称为必填", "warning");
				return;
			}

			//老客户修改（如果是直接导过来得数据可能不存在电话号码，但是mdm那边如果有业务联系人信息则电话号码是必传的）
			if( "upd" == page_action && "upd" == action_type )
			{
				if( null != CustomerLinkmans )
				{
					for (var i in CustomerLinkmans)
					{
						var mobileValue = CustomerLinkmans[i].Mobile;
						mobileValue = mobileValue.replace(/\s+/g,'')

						if (mobileValue.length < 8)
						{
							swalMsg("", "请输入正确的业务联系人电话号码！", "warning");
							return;
						}
					}
				}
			}

			$(".await").fadeIn(300);
			$.ajax({
				type: "post",
				url: "../customers/checkIfRepeat.json",
				data: {jsonData : JSON.stringify(json)},
				dataType: "json",
				success: function(data) {
					$(".await").fadeOut(300);
					if (data.success === true) {
						data = data.message;
						var ifRepeatErpPackageCode = true;
						if (page_action != "one") {
							a: for (var i in data) {
								if (data[i].ErpPackageCode == json.ErpPackageCode) {
									for (var j in CustomerPartnerInfos) {
										// 是自己的合作伙伴
										if (CustomerPartnerInfos[j].PartnerId == data[i].Id && !CustomerPartnerInfos[j].IsFreezed) {
											ifRepeatErpPackageCode = false;
											break a;
										}
									}
								}
							}
						}
						var checkId = this_HeadsId;
						if (page_action == "upd" && action_type == "upd") {
							checkId = CustomerHeads.HeadsId;
						}
						for (var i in data) {
							if (data[i].Name == json.Name && data[i].Id != checkId) {
								swalMsg("", "客户名称与" + data[i].Code + (data[i].ErpCode ? "-" + data[i].ErpCode : "") + "名称重复，请重新输入", "warning");
								return;
							}
							if (page_action != "one") {
								if (ifRepeatErpPackageCode && data[i].ErpPackageCode == json.ErpPackageCode && data[i].Id != checkId) {
									//2019-06-23 cc #IY57P
									//碰吗重复校验增加反合作伙伴信息晕下喷码重复
									var blIsAllow = false;
									if (data[i].cusPartnerInfos) {
										for (var j in data[i].cusPartnerInfos) {
											var cusPartnerInfo = data[i].cusPartnerInfos[j];
											if (cusPartnerInfo.Id == checkId) {//cusPartnerInfo.ErpPackageCode == json.ErpPackageCode &&
												blIsAllow = true;
											}
										}
									}
									if (!blIsAllow) {
										swalMsg("", "客户喷码与" + data[i].Code + (data[i].ErpCode ? "-" + data[i].ErpCode : "") + "喷码重复，请重新输入", "warning");
										return;
									}
								}
							}
						}
						// 改了名字
						if (json.Name != CustomerHeads.Name) {
							CustomerHeads.LastOldName = CustomerHeads.Name;
						}
						saveCustomer();
					} else {
						swalMsg("", "检查客户名称失败", "error");
						return;
					}
				}, error: function() {
					$(".await").fadeOut(300);
					swalMsg("", "检查客户名称失败", "error");
				}
			});
		}
	});

	// 保存客户
	function saveCustomer() {
		var submitData = {};
		submitData.page_action = page_action;
		var swalStr = "";
		if (page_action == "one") {
			CustomerHeads.Name = $("#one_Name").val();
			if (!CustomerHeads.Name) {
				swalStr += "客户名称,";
			}
			if (!CustomerHeads.RegionName) {
				swalStr += "注册区域,";
			}
			if (swalStr != "") {
				swalMsg("", "基本信息中:" + swalStr.substr(0, swalStr.length - 1) + " 不能为空", "error");
				return;
			}
			if (!$("#oneCustomerHeadsInvoice_form").valid()) {
				swalMsg("", "开票信息中包含必填项或格式有误！", "error");
				return;
			}
			// 组织机构必填
			if (CustomerOrganizations == null || CustomerOrganizations.length == 0) {
				swalMsg("", "请至少添加一条组织机构信息", "error");
				return;
			}
			CustomerHeads.LegalPerson = $("#one_LegalPerson").val();
			CustomerHeads.InvoiceReceiver = $("#InvoiceReceiver").val();
			CustomerHeads.InvoiceReceiverTele = $("#InvoiceReceiverTele").val();
			CustomerHeads.InvoiceMailAddress = $("#InvoiceMailAddress").val();
			CustomerHeads.InvoiceLocalNumber = $("#InvoiceLocalNumber").val();
			CustomerHeads.TaxId = $("#TaxId").val();
			CustomerHeads.InvoiceTele = $("#InvoiceTele").val();
			CustomerHeads.InvoiceAddress = $("#InvoiceAddress").val();
			CustomerHeads.InvoiceBank = $("#InvoiceBank").val();
			CustomerHeads.InvoiceAccount = $("#InvoiceAccount").val();
			submitData.CustomerOrganizations = CustomerOrganizations;
			submitData.CustomerHeads = CustomerHeads;
		} else {
			if (!$("#CustomerHeads_form").valid()) {
				swalMsg("", "基础信息中包含必填项或格式有误！", "error");
				return;
			}
			if (!$("#CustomerHeadsInvoice_form").valid()) {
				swalMsg("", "开票信息中包含必填项或格式有误！", "error");
				return;
			}
			// 基础信息
			CustomerHeads.Name = $("#Name").val();
			if (!CustomerHeads.Name) {
				swalStr += "客户名称,";
			}
			if (!CustomerHeads.AppraisalRegionId) {
				swalStr += "考核省区,";
			}
			if (!CustomerHeads.AppraisalCityName) {
				swalStr += "考核城市,";
			}
			if (!CustomerHeads.RegionName) {
				swalStr += "注册区域,";
			}
			CustomerHeads.ErpPackageCode = $("#ErpPackageCode").val();
			CustomerHeads.LegalPerson = $("#LegalPerson").val();
			if (!CustomerHeads.LegalPerson) {
				swalStr += "法人代表,";
			}
			CustomerHeads.LegalPersonIdCard = $("#LegalPersonIdCard").val();
			if (CustomerHeads.CustomerTypeCode != "qt") {
				if (!CustomerHeads.LegalPersonIdCard) {
					swalStr += "法人身份证号,";
				}else {
					if (CustomerHeads.LegalPersonIdCard.length <15 ||
							CustomerHeads.LegalPersonIdCard.length > 18) {
						swalStr += "法人身份证号位数,";
					}
				}
			}else {
				if (CustomerHeads.LegalPersonIdCard.length > 18) {
					swalStr += "法人身份证号位数,";
				}
			}
			CustomerHeads.Address = $("#Address").val();
			if (!CustomerHeads.Address) {
				swalStr += "办公地址,";
			}
			CustomerHeads.Telephone = $("#Telephone").val();
			if (!CustomerHeads.Telephone) {
				swalStr += "联系电话,";
			}
			CustomerHeads.Email = $("#Email").val();
			CustomerHeads.PostalCode = $("#PostalCode").val();
			if (!CustomerHeads.PostalCode) {
				swalStr += "邮政编码,";
			}
			CustomerHeads.Caption = $("#Caption").val();
			if (!CustomerHeads.Caption) {
				swalStr += "申请说明,";
			}
			if (!CustomerHeads.OrganizationId) {
				swalStr += "申请单位,";
			}
			if (swalStr != "") {
				swalMsg("", "基本信息中:" + swalStr.substr(0, swalStr.length - 1) + " 不能为空", "error");
				return;
			}

			// 开票信息
			CustomerHeads.InvoiceReceiver = $("#InvoiceReceiver").val();
			if (!CustomerHeads.InvoiceReceiver) {
				swalStr += "发票收件人,";
			}
			CustomerHeads.InvoiceReceiverTele = $("#InvoiceReceiverTele").val();
			CustomerHeads.InvoiceMailAddress = $("#InvoiceMailAddress").val();
			if (!CustomerHeads.InvoiceMailAddress) {
				swalStr += "发票邮寄地址,";
			}
			CustomerHeads.TaxId = $("#TaxId").val();
			CustomerHeads.InvoiceTele = $("#InvoiceTele").val();
			CustomerHeads.InvoiceAddress = $("#InvoiceAddress").val();
			CustomerHeads.InvoiceBank = $("#InvoiceBank").val();
			CustomerHeads.InvoiceAccount = $("#InvoiceAccount").val();
			CustomerHeads.InvoiceLocalNumber = $("#InvoiceLocalNumber").val();
			if (CustomerHeads.IsNeedTax) {
				if (!CustomerHeads.TaxId) {
					swalStr += "增值税号,";
				}
				if (!CustomerHeads.InvoiceTele) {
					swalStr += "税票电话,";
				}
				if (!CustomerHeads.InvoiceAddress) {
					swalStr += "税票地址,";
				}
				if (!CustomerHeads.InvoiceBank) {
					swalStr += "开户行,";
				}
				if (!CustomerHeads.InvoiceAccount) {
					swalStr += "银行账号,";
				}
			}
			if (swalStr != "") {
				swalMsg("", "开票信息中:" + swalStr.substr(0, swalStr.length - 1) + " 不能为空", "error");
				return;
			}
			// 开户预期销售信息必填
			if (CustomerHeads.CustomerTypeCode != "qt" && (CustomerExpectedSales == null || CustomerExpectedSales.length == 0)) {
				swalMsg("", "请至少添加一条开户预期销售信息", "error");
				return;
			}
			for (var i in CustomerExpectedSales) {
				CustomerExpectedSales[i].SalesStartDate = CustomerExpectedSales[i].SalesStartDate ? getDate(new Date(CustomerExpectedSales[i].SalesStartDate)) : null;
				CustomerExpectedSales[i].SalesEndDate = CustomerExpectedSales[i].SalesEndDate ? getDate(new Date(CustomerExpectedSales[i].SalesEndDate)) : null;
			}
			// 组织机构必填
			if (CustomerOrganizations == null || CustomerOrganizations.length == 0) {
				swalMsg("", "请至少添加一条组织机构信息", "error");
				return;
			}

			// 可发送sap
			if (CustomerHeads.CanSendToERP) {
				if (CustomerCorporationInfos == null || CustomerCorporationInfos.length == 0) {
					swalMsg("", "可发送erp的客户请至少添加一条公司信息", "error");
					return;
				}
				a : for (var i in CustomerCorporationInfos) {
					for (var j in CustomerSalesInfos) {
						if (CustomerCorporationInfos[i].CorporationId == CustomerSalesInfos[j].SalesOrganizationId) {
							continue a;
						}
					}
					swalMsg("", "请确认一条公司信息至少对应一条销售信息", "error");
					return;
				}
			}

			// 统驭科目和客户账户组对不上
			for (var j in CustomerCorporationInfos) {
				if (CustomerCorporationInfos[j].LedgerAccountId != CustomerHeads.LedgerAccounts) {
					swalMsg("", "公司信息中包含非'" + CustomerHeads.CustomerAccountGroupName + "'对应的统驭科目，请修改", "error");
					return;
				}
			}

			CustomerHeads.AnnualSales = $("#AnnualSales").val() ? $("#AnnualSales").val() : null;
			CustomerHeads.AnnualSpiritSales = $("#AnnualSpiritSales").val() ? $("#AnnualSpiritSales").val() : null;
			CustomerHeads.WorkingFund = $("#WorkingFund").val() ? $("#WorkingFund").val() : null;

			CustomerHeads.CustomerSaleCapacity = $("#CustomerSaleCapacity").val();
			CustomerHeads.ManageCapacity = $("#ManageCapacity").val();
			CustomerHeads.SalesChannel = $("#SalesChannel").val();

			CustomerHeads.SalesRank = $("#SalesRank").val() ? $("#SalesRank").val() : null;
			CustomerHeads.NumberOfEmployee = $("#NumberOfEmployee").val() ? $("#NumberOfEmployee").val() : null;
			CustomerHeads.NumberOfSalesman = $("#NumberOfSalesman").val() ? $("#NumberOfSalesman").val() : null;
			CustomerHeads.NumberOfPlaner = $("#NumberOfPlaner").val() ? $("#NumberOfPlaner").val() : null;
			CustomerHeads.NumberOfManager = $("#NumberOfManager").val() ? $("#NumberOfManager").val() : null;
			CustomerHeads.NumberOfServeman = $("#NumberOfServeman").val() ? $("#NumberOfServeman").val() : null;
			CustomerHeads.NumberOfVehicle = $("#NumberOfVehicle").val() ? $("#NumberOfVehicle").val() : null;
			CustomerHeads.NumberOfChar = $("#NumberOfChar").val() ? $("#NumberOfChar").val() : null;
			CustomerHeads.StoreArea = $("#StoreArea").val() ? $("#StoreArea").val() : null;
			CustomerHeads.OfficeArea = $("#OfficeArea").val() ? $("#OfficeArea").val() : null;
			CustomerHeads.SpecialMoney = $("#SpecialMoney").val() ? $("#SpecialMoney").val() : null;
			CustomerHeads.IsSaleOurProduct = $("#IsSaleOurProduct").val() == "是" ? 1 : 0;
			CustomerHeads.SaleOurProducts = $("#SaleOurProducts").val();
			CustomerHeads.IsHaveKithOrKin = $("#IsHaveKithOrKin").val() == "是" ? 1 : 0;
			CustomerHeads.OtherRemark = $("#OtherRemark").val();
			if (page_action == "new" && action_type == "new") {
				CustomerHeads.HeadsId = this_HeadsId;
			}
			var newCustomerHeads = Clone(CustomerHeads);
			var newFiles = Clone(Files);
			var newCustomerLinkmans = Clone(CustomerLinkmans);
			var newCustomerDeliveryAddrs = Clone(CustomerDeliveryAddrs);
			var newCustomerDistributes = Clone(CustomerDistributes);
			var newCustomerMarketings = Clone(CustomerMarketings);
			var newCustomerKithOrKins = Clone(CustomerKithOrKins);
			var newCustomerPolicymakers = Clone(CustomerPolicymakers);
			var newCustomerExpectedSales = Clone(CustomerExpectedSales);
			var newCustomerOrganizations = Clone(CustomerOrganizations);
			var newCustomerCorporationInfos = Clone(CustomerCorporationInfos);
			var newCustomerSalesInfos = Clone(CustomerSalesInfos);
			var newCustomerPartnerInfos = Clone(CustomerPartnerInfos);
			// 老客户修改
			if (page_action == "upd" && action_type == "new" && this_HeadsId == CustomerHeads.Id) {
				var new_id = getUUID();
				newCustomerHeads.Id = new_id;
				for (var i in newFiles) {
					newFiles[i].Id = getUUID();
					newFiles[i].SourceId = new_id;
				}
				for (var i in newCustomerLinkmans) {
					newCustomerLinkmans[i].Id = getUUID();
					newCustomerLinkmans[i].HeadsId = new_id;
				}
				for (var i in newCustomerDeliveryAddrs) {
					newCustomerDeliveryAddrs[i].Id = getUUID();
					newCustomerDeliveryAddrs[i].HeadsId = new_id;
				}
				for (var i in newCustomerDistributes) {
					newCustomerDistributes[i].Id = getUUID();
					newCustomerDistributes[i].HeadsId = new_id;
				}
				for (var i in newCustomerMarketings) {
					newCustomerMarketings[i].Id = getUUID();
					newCustomerMarketings[i].HeadsId = new_id;
				}
				for (var i in newCustomerKithOrKins) {
					newCustomerKithOrKins[i].Id = getUUID();
					newCustomerKithOrKins[i].HeadsId = new_id;
				}
				for (var i in newCustomerPolicymakers) {
					newCustomerPolicymakers[i].Id = getUUID();
					newCustomerPolicymakers[i].HeadsId = new_id;
				}
				for (var i in newCustomerExpectedSales) {
					newCustomerExpectedSales[i].Id = getUUID();
					newCustomerExpectedSales[i].HeadsId = new_id;
				}
				for (var i in newCustomerOrganizations) {
					newCustomerOrganizations[i].Id = getUUID();
					newCustomerOrganizations[i].HeadsId = new_id;
				}
				for (var i in newCustomerCorporationInfos) {
					newCustomerCorporationInfos[i].Id = getUUID();
					newCustomerCorporationInfos[i].HeadsId = new_id;
				}
				for (var i in newCustomerSalesInfos) {
					newCustomerSalesInfos[i].Id = getUUID();
					newCustomerSalesInfos[i].HeadsId = new_id;
				}
				for (var i in newCustomerPartnerInfos) {
					newCustomerPartnerInfos[i].Id = getUUID();
					newCustomerPartnerInfos[i].HeadsId = new_id;
				}
			}
			submitData.CustomerHeads = newCustomerHeads;
			submitData.Files = newFiles;
			submitData.CustomerLinkmans = newCustomerLinkmans;
			submitData.CustomerDeliveryAddrs = newCustomerDeliveryAddrs;
			submitData.CustomerDistributes = newCustomerDistributes;
			submitData.CustomerMarketings = newCustomerMarketings;
			submitData.CustomerKithOrKins = newCustomerKithOrKins;
			submitData.CustomerPolicymakers = newCustomerPolicymakers;
			submitData.CustomerExpectedSales = newCustomerExpectedSales;
			submitData.CustomerOrganizations = newCustomerOrganizations;
			submitData.CustomerCorporationInfos = newCustomerCorporationInfos;
			submitData.CustomerSalesInfos = newCustomerSalesInfos;
			submitData.CustomerPartnerInfos = newCustomerPartnerInfos;
		}
		// 新客户开户
		if (action_type == "new") {
			$(".await").show();
			$.ajax({
				type: "post",
				url: "../customers/insertCustomer.json",
				data: {jsonData : JSON.stringify(submitData)},
				dataType: "json",
				success: function(data) {
					$(".await").hide();
					if (data.success === true) {
						this_HeadsId = newCustomerHeads.Id;
						CustomerHeads = newCustomerHeads;
						Files = newFiles;
						CustomerLinkmans = newCustomerLinkmans;
						CustomerDeliveryAddrs = newCustomerDeliveryAddrs;
						CustomerDistributes = newCustomerDistributes;
						CustomerMarketings = newCustomerMarketings;
						CustomerKithOrKins = newCustomerKithOrKins;
						CustomerPolicymakers = newCustomerPolicymakers;
						CustomerExpectedSales = newCustomerExpectedSales;
						CustomerOrganizations = newCustomerOrganizations;
						CustomerCorporationInfos = newCustomerCorporationInfos;
						CustomerSalesInfos = newCustomerSalesInfos;
						CustomerPartnerInfos = newCustomerPartnerInfos;
						swal({
							title: "",
							timer: 3000,
							text: "新增成功",
							type: "success",
							confirmButtonText: "确定"
						}, function() {
							if (page_action == "new") {
								window.location.href = "../cutomerRequestHeads/index.html";
							}
							if (page_action == "upd") {
								window.location.href = "../customerOldUpd/index.html";
							}
							if (page_action == "detail") {
								window.location.href = "../customerheads/index.html";
							}
							if (page_action == "one") {
								window.location.href = "../dispoableCustomer/index.html";
							}
						});
					} else {
						swalMsg("", data.message, "error");
					}
				}, error: function() {
					$(".await").hide();
					swalMsg("", "网络连接失败，请重试或联系管理员", "error");
				}
			});
		}
		// 老客户修改
		if (action_type == "upd") {
			$(".await").show();
			submitData.isupded = isupded;
			$.ajax({
				type: "post",
				url: "../customers/updateCustomer.json",
				data: {jsonData : JSON.stringify(submitData)},
				dataType: "json",
				success: function(data) {
					$(".await").hide();
					if (data.success === true) {
						swal({
							title: "",
							timer: 3000,
							text: "修改成功",
							type: "success",
							confirmButtonText: "确定"
						}, function() {
							window.location.reload();
						});
					} else {
						swal({
							title: "",
							text: data.message,
							type: "error",
							confirmButtonColor: "#F27474",
							confirmButtonText: "确定"
						}, function() {
							//window.location.reload();
						});
					}
				}, error: function() {
					$(".await").hide();
					swalMsg("", "网络连接失败，请重试或联系管理员", "error");
				}
			});
		}
	}
});
