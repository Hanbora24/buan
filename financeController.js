angular.module('app.finance').controller('financeController',financeController);

function financeController($scope, $state, $stateParams, mainDataService, $rootScope, $compile, $timeout, $interval, ConfigService, YearSet, GridConfig, Message) {
	
	$scope.setWeek = function setLastWeek() {
        var sday = new Date(); // 6개월
        sday.setMonth(sday.getMonth() - 6); // 6개월전으로 set

        var today = new Date(); // 오늘

        var sYear = sday.getFullYear();
        var eYear = today.getFullYear();
        var s_yyyymmdd = sYear + '-' + ('0' + (sday.getMonth() + 1)).substr(-2) + '-' + ('0' + sday.getDate()).substr(-2);
        var e_yyyymmdd = eYear + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);

        $scope.searchDate.S_DATE = s_yyyymmdd;
        $('#searchDate_S_DATE').val(s_yyyymmdd);
        $scope.searchDate.E_DATE = e_yyyymmdd;
        $('#searchDate_E_DATE').val(e_yyyymmdd);
    }
	
	 $scope.$on('$viewContentLoaded', function () {
		    	$("#tab1_btn").on("click", function() {
		    		$(this).addClass("active");
		    		$("#tab2_btn, #tab3_btn, #tab4_btn, #tab5_btn").removeClass("active");
		    		$("#tab1").show();
		    		$("#tab2, #tab3, #tab4, #tab5").hide();
		    	});
		    	$("#tab2_btn").on("click", function() {
		    		$(this).addClass("active");
		    		$("#tab1_btn, #tab3_btn, #tab4_btn, #tab5_btn").removeClass("active");
		    		$("#tab2").show();
		    		$("#tab1, #tab3, #tab4, #tab5").hide();
		    	});
		    	$("#tab3_btn").on("click", function() {
		    		$(this).addClass("active");
		    		$("#tab2_btn, #tab1_btn, #tab4_btn, #tab5_btn").removeClass("active");
		    		$("#tab3").show();
		    		$("#tab1, #tab2, #tab4, #tab5").hide();
		    	});
		    	$("#tab4_btn").on("click", function() {
		    		$(this).addClass("active");
		    		$("#tab2_btn, #tab1_btn, #tab3_btn, #tab5_btn").removeClass("active");
		    		$("#tab4").show();
		    		$("#tab1, #tab2, #tab3, #tab5").hide();
		    	});
		    	$("#tab5_btn").on("click", function() {
		    		$(this).addClass("active");
		    		$("#tab2_btn, #tab1_btn, #tab3_btn, #tab4_btn").removeClass("active");
		    		$("#tab5").show();
		    		$("#tab1, #tab2, #tab3, #tab4").hide();
		    	});
		    	
		    	setGrid();
		    	setDatePicker();
		    	$scope.setWeek();
		    	$scope.setDatePicker = setDatePicker;
		    	$scope.MCODE = '0402';
		    	$rootScope.setBtnAuth($scope.MCODE);
		    });
	 
	 	$scope.tabGraphChange = function(){
	    	$("#tab1_1_btn_g").on("click",function(){
	    		$(this).addClass("active");
	    		$("#tab1_2_btn_g").removeClass("active");
	    		$("#chartFinancialBalance").show();
	    		$("#chartInflation").hide();
	    	});
	    	$("#tab1_2_btn_g").on("click",function(){
	    		$(this).addClass("active");
	    		$("#tab1_1_btn_g").removeClass("active");
	    		$("#chartInflation").show();
	    		$("#chartFinancialBalance").hide();
	    	});
	 	};
		 
	 	$scope.searchDateType = '1'; // 날짜검색 : 연도(1) or 기간선택(2)
	    $scope.searchDate = {}; // 기간선택
	    $scope.planName = ''; // 계획명
	    $scope.changeRadio = function (type) {
	        $scope.searchDateType = (type === 1) ? 1 : 2;
	    };
	    //$scope.storeYear = getYears(YearSet.baseYear, YearSet.plus);
	    $scope.selectedCurrYear = $scope.selectedYear = '' + (new Date()).getFullYear();
	    $scope.MCODE = '0205';
	    
	    $scope.SelectedFinanceInfo = {};
		$scope.fin_anls_sid = '';
		//$scope.yearList=['2022','2023','2024','2025','2026','2027','2028','2029','2030'];
		$scope.C_SCODE = '02';
		
		 function setGrid() {
		        return pagerJsonGrid({
		            grid_id : 'list',
		            pager_id : 'listPager',
		            url : '/finance/getFinancialPlanList.json',
		            condition : {
		                page : 1,
		                rows : GridConfig.sizeL,
		                temp_yn     : 'N',
		                del_yn   : 'N',
		            },
		            rowNum : 18,
		            colNames : [ '순번', 'SID','분석명','분석일', '작성자', '작성일자','물가상승률'],
		            colModel : [
		                { name : 'RNUM', width : 42 },
		                { name : 'FIN_ANLS_SID', width : 0, hidden: true },
		                { name : 'FIN_ANLS_NM', width : 150 },
		                { name : 'FIN_ANLS_YMD', width :80  },
		                { name : 'WRTR_NM', width : 80 },
		                { name : 'WRT_YMD', width : 80 },
		                /*{ name : 'FIN_ANLS_YMD', width :0 , hidden: true },*/
		                { name : 'PRICE_RAISE_RATIO', width :0 , hidden: true }
		            ],
		            onSelectRow : function(rowid, status, e) {
		                var param = $('#list').jqGrid('getRowData', rowid);
		                $scope.SelectedFinanceInfo = $('#list').jqGrid('getRowData', rowid);
		            	if (parseInt($scope.SelectedFinanceInfo.FIN_ANLS_SID) > 0) {
		            		$scope.fin_anls_sid = $scope.SelectedFinanceInfo.FIN_ANLS_SID;
		            	}
		            	$scope.tabClick($scope.selectedTabId);
		            	$scope.OCtabClick($scope.C_SCODE);
		            	//console.log($scope.SelectedFinanceInfo);
		                $scope.$apply();
		            },
		            gridComplete : function() {
						var ids = $(this).jqGrid('getDataIDs');
						$(this).setSelection(ids[0]);
						$scope.currentPageNo = $('#list').getGridParam('page');
						$scope.count = $('#list').getGridParam('records');
						$scope.tabClick('FN09');
						$scope.OCtabClick('02');
						$scope.$apply();
					}
		        });
		    }
		 
		 	//조회
		 	$scope.search = function () {
		        var data = {};

		        data.page = 1;
		        data.rows = GridConfig.sizeL;
		        data.type = $scope.searchDateType || '';

		        // 연도 검색
		        if ($scope.searchDateType === 1) {
		            data.year = $scope.selectedCurrYear || '';
		        // 기간선택 검색
		        } else {
		            data.s_date = $scope.searchDate.S_DATE || '';
		            data.e_date = $scope.searchDate.E_DATE || '';

		            // 날짜 체크 (최대 1년 까지 조회, '시작 날짜 < 종료 날짜' 이어야 함)
		            if (!checkDate($scope.searchDate.S_DATE, $scope.searchDate.E_DATE, '')) {
		                return;
		            }
		        }
		        console.log(data);

		        if ($scope.planName !== null || $scope.planName !== '') {
		        	data.fin_anls_nm = $scope.planName;
		        }

		        $('#list').jqGrid('setGridParam', {
		            postData: data,
		        }).trigger('reloadGrid', {
		            current: true,
		        });
		    };

		    
		    //삭제
		    $scope.deleteFinance = function () {
		        if (!($scope.SelectedFinanceInfo.FIN_ANLS_SID > 0)) {
		            alertify.alert('','항목을 선택해주세요');
		            return;
		        }

		        // 삭제 권한 체크
		        if (sessionStorage.getItem($scope.MCODE + 'E') != 'true' || sessionStorage.getItem($scope.MCODE + 'V') != 'true') {
		            alertify.alert('','권한이 없습니다.');
		            return;
		        }

		        alertify.confirm('삭제 확인', '선택하신 자료를 삭제 하시겠습니까?',
		            function () {
		                mainDataService.deleteFinancialPlan({
		                    fin_anls_sid: $scope.SelectedFinanceInfo.FIN_ANLS_SID,
		                    del_yn: 'Y',
		                }).success(function (obj) {
		                    if (!common.isEmpty(obj.errMessage)) {
		                        alertify.error('errMessage : ' + obj.errMessage);
		                    } else {
		                        alertify.success('계획이 삭제 되었습니다.');
		                        firstPage("list"); //목록 새로고침
		                        $scope.SelectedFinanceInfo = {};
		                    }
		                });
		            },
		            function () {
		            }
		        ).set('basic', false);
		    };
		    
		    $scope.loadList = function(){
				$("#list").setGridParam({
					datatype : 'json',
					page : $scope.currentPageNo,
					postData : {

					}
				}).trigger('reloadGrid', {
					current : true
				});		
			};
			
			//분석일 기준 이후 30년으로 연도 정렬
	    	$scope.yearChange = function(){
		    	 var yyyy = $scope.PopupFinanceInfo.FIN_ANLS_YMD.substring(0, 4); // 분석일 2020-05-01 -> 2020
	    	      console.log(yyyy);
	    	      $scope.PopupyearList2 = [];
	    	      for (let i = 0; i < 30; i++) {
	    	         $scope.PopupyearList2[i] = Number(yyyy) + (i );
	    	      };
	    	};

		    
		    //재정수지분석 목록
		    $scope.FinancialList = [];
		    $scope.FinanceDetailList = [];
		    
		    mainDataService.getCommonCodeList({
		        gcode : 'FN08',
		        gname : ''
		    }).success(function(data){
		    	 if (!common.isEmpty(data.errMessage)) {
		             alertify.error('errMessage : ' + data.errMessage);
		         } else {
		             $scope.FinancialList = data;
		         }
		    	 //console.log($scope.FinancialList);
		    });
		    
		    //보고서
		    $scope.Report = function() {
		    	let jobType = $state.current.name;
		    	let sid = $scope.SelectedFinanceInfo.FIN_ANLS_SID;
		    	window.open('/excel/downloadExcel.do?EXCEL_ID=' + jobType + '&FIN_ANLS_SID=' + sid, '_blank');
		    }
		    
		    //재정수지분석 탭
		    $scope.selectedTabId = 'FN09';
			$scope.tabClick = function(C_CVALUE1){
				$scope.selectedTabId = C_CVALUE1; 
				console.log($scope.selectedTabId);
				//탭의 C_CVALUE1 넘기기
				mainDataService.getFinancialPlanDetailList({
					fin_anls_sid : $scope.SelectedFinanceInfo.FIN_ANLS_SID,
					fin_anls_type : $scope.selectedTabId
			    }).success(function(data){
			    	if(data.length ==0){
			    		$scope.FinanceDetailList = [];
			    		return;
			    	}
			    	var list = [
			    		'FIN_ANLS_GUBUN_NM',
			    		'FIN_ANLS_ITEM_CD',
			    		'FIN_ANLS_ITEM_NM',
			    		'FIN_ANLS_SID',
			    		'FIN_ANLS_TYPE',
			    		'C_GCODE',
			    		'C_SCODE',
			    		'\'0000\'',
			    		'C_NAME',
			    		'LOAN_ITEM_CD',
			    		'LOAN_ITEM_YEAR'
			    	];
			    	$scope.yearList2 = [];
			    	$.each(data,function(idx,Item){
						if(idx==0)
						$.each(Item,function(idx2,Item2){
							if($.inArray(idx2,list)<0)
								$scope.yearList2.push(idx2.replace(/'/gi,''));
						});
					});
					$scope.yearList2.sort();
					
					if ($scope.selectedTabId !== 'FN09') {
						var indexOfSum;
						$.each(data, function (idx, item) {
							if (item.FIN_ANLS_ITEM_NM !== undefined) {
								if(item.FIN_ANLS_ITEM_NM.includes("합계")) {
									indexOfSum = idx;
								}
							}
							if (item.C_NAME !== undefined) {
								if(item.C_NAME.includes("합계")) {
									indexOfSum = idx;
								}
							}
						});
	
						var fnNotSum = {
								'FN10' : ['01','02','03','04','05','06'],
								'FN11' : [],
								'FN12' : [],
						};
						
						//연도별합계
						$.each($scope.yearList2, function(idx2, yyyy) {
							var initialValue = 0;
							var sum = data.reduce(function(accumulator, currentValue, currentIndex) {
								if (currentIndex == indexOfSum) {
									return parseFloat(accumulator) + 0;
								} else {
									if($.inArray(currentValue['C_SCODE'],fnNotSum[$scope.PopupselectedTabId])>=0){
										return parseFloat(accumulator) + 0;
									}else{
										return parseFloat(accumulator) + parseFloat(currentValue['\'' + yyyy + '\''] || 0);	
									}
								}
							}, initialValue);
							data[indexOfSum]['\'' + yyyy + '\''] = sum;
						});
			    	}
					
			    	var FIN_ANLS_GUBUN_NM = data[0].FIN_ANLS_GUBUN_NM; // 컬럼 이름 맞추기 //rowspan
			 		$scope.GB_ARRAY = new Array(); //array scope안해도됨
			 		$scope.GB_ARRAY.push({name:data[0].FIN_ANLS_GUBUN_NM,cnt:1,idx:0});
			 		$.each(data,function(idx,item){
			 			if(data[idx].FIN_ANLS_GUBUN_NM == FIN_ANLS_GUBUN_NM){
			 				if(idx>0)
		 					$scope.GB_ARRAY[$scope.GB_ARRAY.length-1].cnt +=1;
			 			}
			 			else{
			 				$scope.GB_ARRAY.push({name:data[idx].FIN_ANLS_GUBUN_NM,cnt:1,idx:idx});	 				
			 			}
			 			FIN_ANLS_GUBUN_NM = data[idx].FIN_ANLS_GUBUN_NM;
			 			item.GB_Idx = $scope.GB_ARRAY.length-1;
			 			item.row_idx = $scope.GB_ARRAY[$scope.GB_ARRAY.length-1].idx;
			 			item.idx = idx;
			 		});
			 		$.each(data,function(idx,item){
			 			item.GB_cnt = $scope.GB_ARRAY[item.GB_Idx].cnt; 
			 		});	
			    	$scope.FinanceDetailList = data;
			    	
			    	if($scope.selectedTabId == 'FN14'){
			    		var C_NAME = data[0].C_NAME; // 컬럼 이름 맞추기 //rowspan
				 		$scope.GB_ARRAY = new Array(); //array scope안해도됨
				 		$scope.GB_ARRAY.push({name:data[0].C_NAME,cnt:1,idx:0});
				 		$.each(data,function(idx,item){
				 			if(data[idx].C_NAME == C_NAME){
				 				if(idx>0)
			 					$scope.GB_ARRAY[$scope.GB_ARRAY.length-1].cnt +=1;
				 			}
				 			else{
				 				$scope.GB_ARRAY.push({name:data[idx].C_NAME,cnt:1,idx:idx});	 				
				 			}
				 			if(data[idx].LOAN_ITEM_YEAR == '0000'){
				 				if(idx>0)
				 					$scope.GB_ARRAY[$scope.GB_ARRAY.length-1].colspan = 3;
				 			}
				 			C_NAME = data[idx].C_NAME;
				 			item.GB_Idx = $scope.GB_ARRAY.length-1;
				 			item.row_idx = $scope.GB_ARRAY[$scope.GB_ARRAY.length-1].idx;
				 			item.idx = idx;
				 		});
				 		$.each(data,function(idx,item){
				 			item.GB_cnt = $scope.GB_ARRAY[item.GB_Idx].cnt;
				 			item.GB_colspan = $scope.GB_ARRAY[item.GB_Idx].colspan;
				 		});	
			    	}
			    	
			    	//console.log($scope.FinanceDetailList);
			    });
				
			};
			

			//연도별합계
			$scope.ChangeSum = function(yyyy){
				//console.log(yyyy);
				//console.log($scope.PopupFinanceDetailList);
				var indexOfSum;
				$.each($scope.PopupFinanceDetailList, function (idx, item) {
					if (item.FIN_ANLS_ITEM_NM !== undefined) {
						if(item.FIN_ANLS_ITEM_NM.includes("합계")) {
							indexOfSum = idx;
						}
					}
					if (item.C_NAME !== undefined) {
						if(item.C_NAME.includes("합계")) {
							indexOfSum = idx;
						}
					}
				});

				var fnNotSum = {
						'FN10' : ['01','02','03','04','05','06'],
						'FN11' : [],
						'FN12' : [],
				};
				//연도별합계
				var initialValue = 0;
				var sum = $scope.PopupFinanceDetailList.reduce(function(accumulator, currentValue, currentIndex) {
					if (currentIndex == indexOfSum) {
						return parseFloat(accumulator) + 0;
					} else {
						if($.inArray(currentValue['C_SCODE'],fnNotSum[$scope.PopupselectedTabId])>=0){
							return parseFloat(accumulator) + 0;
						}else{
							return parseFloat(accumulator) + parseFloat(currentValue['\'' + yyyy + '\''] || 0);	
						}
					}
				}, initialValue);
				$scope.PopupFinanceDetailList[indexOfSum]['\'' + yyyy + '\''] = sum;
				
				if($scope.PopupselectedTabId=='FN10'){
					var listVal = [];
					var cnt=0;
					var sum1 = $scope.PopupFinanceDetailList.reduce(function(accumulator, currentValue, currentIndex) {
						if (currentIndex == indexOfSum) {
							return parseFloat(accumulator) + 0;
						} else {
							if($.inArray(currentValue['C_SCODE'],fnNotSum[$scope.PopupselectedTabId])>=0){
								listVal.push(parseFloat(currentValue['\'' + yyyy + '\''] || 0));
								return parseFloat(accumulator) + 0;	
							}else{
								var rate = (cnt<listVal.length-1)?listVal[cnt+1]:0;
								cnt++;
								return parseFloat(accumulator) + parseFloat(currentValue['\'' + yyyy + '\''] || 0)  * rate;	
							}
						}
					}, initialValue);
					$scope.PopupFinanceDetailList[0]['\'' + yyyy + '\''] = sum1;
				}
					
			};
			
			//재정수지총괄 계산
			$scope.CalculationFinancial = function(yyyy){
				var indexOfSum;
	    		var indexOfProfit;
	    		var indexOfLoss;
	    		var indexOfSum2;
	    		var indexOfProfit2;
	    		var indexOfLoss2;
	    		var indexOfFund;
	    		var indexOfCapital;
	    		$.each($scope.PopupFinanceDetailList, function (idx, item) {
	    			if (item.C_SCODE == '301') { //손익계정보유자금
						indexOfSum = idx;
					}
	    			if (item.C_SCODE == '107'){ //수익적수지 수입부 합계 
	    				indexOfProfit = idx;
	    			}
	    			if (item.C_SCODE == '208'){ //수익적수지 지출부 합계 
	    				indexOfLoss = idx;
	    			}
	    			if (item.C_SCODE == '601') { //자본적수치 과부족액
	    				indexOfSum2 = idx;
	    			}
	    			if (item.C_SCODE == '410'){ //자본적수치 수입부 합계 
	    				indexOfProfit2 = idx;
	    			}
	    			if (item.C_SCODE == '509'){ //자본적수치 지출부 합계 
	    				indexOfLoss2 = idx;
	    			}
	    			if (item.C_SCODE == '701'){ //자금수지-손익계정보유자금
	    				indexOfFund = idx;
	    			}
	    			if (item.C_SCODE == '703'){ //자금수지-자본적수치 과부족액
	    				indexOfCapital = idx;
	    			}
				});
	    		$scope.PopupFinanceDetailList[indexOfProfit]['\'' + yyyy + '\''] = 0;
	    		$scope.PopupFinanceDetailList[indexOfLoss]['\'' + yyyy + '\''] = 0;
	    		$scope.PopupFinanceDetailList[indexOfProfit2]['\'' + yyyy + '\''] = 0;
	    		$scope.PopupFinanceDetailList[indexOfLoss2]['\'' + yyyy + '\''] = 0;
	    		
	    		//$.each($scope.yearList2, function(idx2, yyyy) {
	    			$.each($scope.PopupFinanceDetailList,function(idx,item){
						if(idx<indexOfProfit){
							$scope.PopupFinanceDetailList[indexOfProfit]['\'' + yyyy + '\''] += Math.round(parseFloat($scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\'']));
						}else if(indexOfProfit< idx && idx<indexOfLoss){
							$scope.PopupFinanceDetailList[indexOfLoss]['\'' + yyyy + '\''] += Math.round(parseFloat($scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\'']));
						}else if(idx<indexOfSum){
							//$scope.PopupFinanceDetailList[indexOfSum]['\'' + yyyy + '\''] += $scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\''];
						}else if(indexOfSum< idx && idx<indexOfProfit2){
							$scope.PopupFinanceDetailList[indexOfProfit2]['\'' + yyyy + '\''] += Math.round(parseFloat($scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\'']));
						}else if(indexOfProfit2<idx && idx<indexOfLoss2){
							$scope.PopupFinanceDetailList[indexOfLoss2]['\'' + yyyy + '\''] += Math.round(parseFloat($scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\'']));
						}else if(idx<indexOfFund){
							//$scope.PopupFinanceDetailList[indexOfFund]['\'' + yyyy + '\''] += $scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\''];
						}else if(idx<indexOfCapital){
							//$scope.PopupFinanceDetailList[indexOfCapital]['\'' + yyyy + '\''] += $scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\''];
						}
						
	    				$scope.PopupFinanceDetailList[indexOfSum]['\'' + yyyy + '\''] = 0;
	    				$scope.PopupFinanceDetailList[indexOfSum2]['\'' + yyyy + '\''] = 0;
	    				$scope.PopupFinanceDetailList[indexOfFund]['\'' + yyyy + '\'']= 0;
	    				$scope.PopupFinanceDetailList[indexOfCapital]['\'' + yyyy + '\''] = 0;
	    				if($scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\''] == null || $scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\'']=='') {
	    					$scope.PopupFinanceDetailList[idx]['\'' + yyyy + '\''] = 0;
	    				}
	    				$scope.PopupFinanceDetailList[indexOfSum]['\'' + yyyy + '\''] = //손익계정보유자금
	    					Math.round(parseFloat($scope.PopupFinanceDetailList[indexOfProfit]['\'' + yyyy + '\'']) - parseFloat($scope.PopupFinanceDetailList[indexOfLoss]['\'' + yyyy + '\'']));
	    				$scope.PopupFinanceDetailList[indexOfSum2]['\'' + yyyy + '\''] = //자본적수지과부족액
	    					Math.round(parseFloat($scope.PopupFinanceDetailList[indexOfProfit2]['\'' + yyyy + '\'']) - parseFloat($scope.PopupFinanceDetailList[indexOfLoss2]['\'' + yyyy + '\'']));
	    				$scope.PopupFinanceDetailList[indexOfFund]['\'' + yyyy + '\''] = parseFloat($scope.PopupFinanceDetailList[indexOfSum]['\'' + yyyy + '\'']); //손익계정보유자금 = 손익계정보유자금
	    				$scope.PopupFinanceDetailList[indexOfCapital]['\'' + yyyy + '\''] = parseFloat($scope.PopupFinanceDetailList[indexOfSum2]['\'' + yyyy + '\'']); //자본적수지과부족액 = 자본적수지과부족액 
	    			});
				//});
			};
			

			//$scope.PopupselectedTabId = 'FN09'
			$scope.PopuptabClick = function(C_CVALUE1,opt){
				if(opt)
				$scope.ApplyFinancialPopup($scope.PopupselectedTabId); //탭 변경시 data update
				
				$scope.PopupselectedTabId = C_CVALUE1; 
				console.log($scope.PopupselectedTabId);
				//탭의 C_CVALUE1 넘기기
		    	
				mainDataService.getFinancialPlanDetailList({
					fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
					fin_anls_type : $scope.PopupselectedTabId
			    }).success(function(data){
			    	if ($scope.PopupselectedTabId !== 'FN09') {
						var indexOfSum;
						$.each(data, function (idx, item) {
							if (item.FIN_ANLS_ITEM_NM !== undefined) {
								if(item.FIN_ANLS_ITEM_NM.includes("합계")) {
									indexOfSum = idx;
								}
							}
							if (item.C_NAME !== undefined) {
								if(item.C_NAME.includes("합계")) {
									indexOfSum = idx;
								}
							}
						});
						var fnNotSum = {
								'FN10' : ['01','02','03','04','05','06'],
								'FN11' : [],
								'FN12' : [],
						};
						//연도별합계
						$.each($scope.yearList2, function(idx2, yyyy) {
							var initialValue = 0;
							var sum = data.reduce(function(accumulator, currentValue, currentIndex) {
								if (currentIndex == indexOfSum) {
									return parseFloat(accumulator) + 0;
								} else {
									if($.inArray(currentValue['C_SCODE'],fnNotSum[$scope.PopupselectedTabId])>=0){
										return parseFloat(accumulator) + 0;
									}else{
										return parseFloat(accumulator) + parseFloat(currentValue['\'' + yyyy + '\''] || 0);	
									}
								}
							}, initialValue);
							data[indexOfSum]['\'' + yyyy + '\''] = sum;
						});
			    	}

					var FIN_ANLS_GUBUN_NM = data[0].FIN_ANLS_GUBUN_NM; // 컬럼 이름 맞추기 //rowspan
					$scope.GB_ARRAY = new Array(); //array scope안해도됨
					$scope.GB_ARRAY.push({ name: data[0].FIN_ANLS_GUBUN_NM, cnt: 1, idx: 0 });
					$.each(data, function(idx, item) {
						if (data[idx].FIN_ANLS_GUBUN_NM == FIN_ANLS_GUBUN_NM) {
							if (idx > 0) {
								$scope.GB_ARRAY[$scope.GB_ARRAY.length - 1].cnt += 1;
							}
						} else {
							$scope.GB_ARRAY.push({name:data[idx].FIN_ANLS_GUBUN_NM,cnt:1,idx:idx});
			 			}
			 			FIN_ANLS_GUBUN_NM = data[idx].FIN_ANLS_GUBUN_NM;
			 			item.GB_Idx = $scope.GB_ARRAY.length-1;
			 			item.row_idx = $scope.GB_ARRAY[$scope.GB_ARRAY.length-1].idx;
			 			item.idx = idx;
			 		});
			 		$.each(data,function(idx,item){
			 			item.GB_cnt = $scope.GB_ARRAY[item.GB_Idx].cnt;
			 		});	
			    	$scope.PopupFinanceDetailList = data;
			    	
			 		if($scope.PopupselectedTabId == 'FN14'){
			    		var C_NAME = data[0].C_NAME; // 컬럼 이름 맞추기 //rowspan
				 		$scope.GB_ARRAY = new Array(); //array scope안해도됨
				 		$scope.GB_ARRAY.push({name:data[0].C_NAME,cnt:1,idx:0});
				 		$.each(data,function(idx,item){
				 			if(data[idx].C_NAME == C_NAME){
				 				if(idx>0)
			 					$scope.GB_ARRAY[$scope.GB_ARRAY.length-1].cnt +=1;
				 			}
				 			else{
				 				$scope.GB_ARRAY.push({name:data[idx].C_NAME,cnt:1,idx:idx});	 				
				 			}
				 			if(data[idx].LOAN_ITEM_YEAR == '0000'){
				 				if(idx>0)
				 					$scope.GB_ARRAY[$scope.GB_ARRAY.length-1].colspan = 3;
				 			}
				 			C_NAME = data[idx].C_NAME;
				 			item.GB_Idx = $scope.GB_ARRAY.length-1;
				 			item.row_idx = $scope.GB_ARRAY[$scope.GB_ARRAY.length-1].idx;
				 			item.idx = idx;
				 		});
				 		$.each(data,function(idx,item){
				 			item.GB_cnt = $scope.GB_ARRAY[item.GB_Idx].cnt;
				 			item.GB_colspan = $scope.GB_ARRAY[item.GB_Idx].colspan;
				 		});	
			    	}
			 		
			 		$scope.yearChange();
			    });
			}
		    

		 	//재무재표(BS)
		 	$scope.FinancialBSList = [];
			mainDataService.getFinancialStatementsList({
				fin_anls_sid : $scope.SelectedFinanceInfo.FIN_ANLS_SID
			}).success(function(data) {
				if (!common.isEmpty(data.errMessage)) {
		            alertify.error('errMessage : ' + data.errMessage);
		        } else {
		            $scope.FinancialBSList = data;
		        }
				//console.log($scope.FinancialBSList);
			});
			
			//손익계산서(PL)
			$scope.FinancialPLList = [];
			mainDataService.getIncomeStatement({
				fin_anls_sid : $scope.SelectedFinanceInfo.FIN_ANLS_SID
			}).success(function(data) {
				if (!common.isEmpty(data.errMessage)) {
					alertify.error('errMessage : ' + data.errMessage);
				} else {
					$scope.FinancialPLList = data;
				}
				//console.log($scope.FinancialPLList);
			});
			
			//현금흐름표(CF)
			$scope.FinancialCFList = [];
			mainDataService.getCashFlowStatement({
				fin_anls_sid : $scope.SelectedFinanceInfo.FIN_ANLS_SID
			}).success(function(data) {
				if (!common.isEmpty(data.errMessage)) {
					alertify.error('errMessage : ' + data.errMessage);
				} else {
					$scope.FinancialCFList = data;
				}
				//console.log($scope.FinancialCFList);
			});
			
			//기타비용관리
			$scope.FinancialOCList = [];
			$scope.FinanceOCDetailList = [];
			
		    mainDataService.getCommonCodeList({
		        gcode : 'FN01',
		        gname : ''
		    }).success(function(data){
		    	 if (!common.isEmpty(data.errMessage)) {
		             alertify.error('errMessage : ' + data.errMessage);
		         } else {
		             $scope.FinancialOCList = data;
		         }
		    	// console.log($scope.FinancialOCList);
		    });	
		    

		    //기타비용 탭
		    //$scope.OCselectedTabId = '02';
			$scope.OCtabClick = function(C_SCODE){
				$scope.OCselectedTabId = 'FN'+C_SCODE; 
				console.log($scope.OCselectedTabId);
				//탭의 C_CVALUE1 넘기기
				mainDataService.getOtherCostManagement({
					fin_anls_sid : $scope.SelectedFinanceInfo.FIN_ANLS_SID,
					etc_cost_cd1 : $scope.OCselectedTabId
			    }).success(function(data){
			    	
			    	$scope.tabInfo[0].DATA = {};
			    	$scope.tabInfo[1].DATA = {};
			    	$scope.tabInfo[2].DATA = {};
			    	$scope.tabInfo[3].DATA = {};
			    	$scope.tabInfo[4].DATA = {};
			    	var yearList = [];
			    	$.each($scope.ComCodeYearList2,function(idx,Item){
			    		yearList.push(Item.C_SCODE);
			    	});
			    	
			    	$.each(yearList,function(idx1,item1){
			    		$.each($scope.tabInfo[0].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY){
			    					/*
			    					if(item2.C_SCODE == 301){
			    						if (Item['\'FN02_201'+'\''] == null || Item['\'FN02_201'+'\''] == 0) {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_301'] = null;
			    						} else {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_301'] = Number(Item['\'FN02_101'+'\''])/Number(Item['\'FN02_201'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 304){
			    						if (Item['\'FN02_204'+'\''] == null || Item['\'FN02_204'+'\''] == 0) {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_304'] = null;
			    						} else {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_304'] = Number(Item['\'FN02_104'+'\''])/Number(Item['\'FN02_204'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 305){
			    						if (Item['\'FN02_205'+'\''] == null || Item['\'FN02_205'+'\''] == 0) {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_305'] = null;
			    						} else {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_305'] = Number(Item['\'FN02_105'+'\''])/Number(Item['\'FN02_205'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 306){
			    						if (Item['\'FN02_206'+'\''] == null || Item['\'FN02_206'+'\''] == 0) {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_306'] = null;
			    						} else {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_306'] = Number(Item['\'FN02_106'+'\''])/Number(Item['\'FN02_206'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 302){ //요금단가 일반용
			    						if ((Item['\'FN02_202'+'\''] == null || Item['\'FN02_202'+'\''] == 0)) {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_302'] = null;
			    						} else {
			    							$scope.tabInfo[0].DATA[''+ item1 +'FN02_302']  = Number(Item['\'FN02_102'+'\''])/Number(Item['\'FN02_202'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 300){ //요금단가 합계
			    						$scope.tabInfo[0].DATA[''+ item1 +'FN02_300'] = 
			    							Number(Item['\'FN02_301'+'\''])+Number(Item['\'FN02_302'+'\''])+Number(Item['\'FN02_304'+'\''])+Number(Item['\'FN02_305'+'\'']) +Number(Item['\'FN02_306'+'\'']);
			    							
			    					}else{
				    					$scope.tabInfo[0].DATA[''+ item1 +'FN02_'+item2.C_SCODE] = Item['\'FN02_'+item2.C_SCODE+'\''];   					
			    					}*/
			    					$scope.tabInfo[0].DATA[''+ item1 +'FN02_'+item2.C_SCODE] = Item['\'FN02_'+item2.C_SCODE+'\'']; 
			    					
			    				}	
			    			});
			    		});
			    		$.each($scope.tabInfo[1].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.tabInfo[1].DATA[''+ item1 +'FN03_'+item2.C_SCODE] = Item['\'FN03_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    		$.each($scope.tabInfo[2].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.tabInfo[2].DATA[''+ item1 +'FN04_'+item2.C_SCODE] = Item['\'FN04_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    		$.each($scope.tabInfo[3].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.tabInfo[3].DATA[''+ item1 +'FN05_'+item2.C_SCODE] = Item['\'FN05_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    		$.each($scope.tabInfo[4].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.tabInfo[4].DATA[''+ item1 +'FN06_'+item2.C_SCODE] = Item['\'FN06_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    	});
			    	$scope.FinanceOCDetailList = data;
			    });				
			}
			
			$scope.OCPopuptabClick = function(C_SCODE){
				$scope.OCPopupselectedTabId = 'FN'+C_SCODE; 
				console.log($scope.OCPopupselectedTabId);
				//탭의 C_CVALUE1 넘기기
				mainDataService.getOtherCostManagement({
					fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
					etc_cost_cd1 : $scope.OCPopupselectedTabId
			    }).success(function(data){
			    	$scope.PopupComCodeYearList2 = angular.copy($scope.ComCodeYearList2);
			    	var yearList = [];
			    	$.each($scope.PopupComCodeYearList2,function(idx,Item){
			    		yearList.push(Item.C_SCODE);
			    	});
			    	$scope.OCtabInfo[0].DATA = {};
			    	$scope.OCtabInfo[1].DATA = {};
			    	$scope.OCtabInfo[2].DATA = {};
			    	$scope.OCtabInfo[3].DATA = {};
			    	$scope.OCtabInfo[4].DATA = {};
			    	$.each(yearList,function(idx1,item1){
			    		$.each($scope.OCtabInfo[0].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY){
			    					/*
			    					if(item2.C_SCODE == 301){
			    						if (Item['\'FN02_201'+'\''] == null || Item['\'FN02_201'+'\''] == 0) {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_301'] = null;
			    						} else {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_301'] = Number(Item['\'FN02_101'+'\''])/Number(Item['\'FN02_201'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 303){
			    						if (Item['\'FN02_204'+'\''] == null || Item['\'FN02_204'+'\''] == 0) {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_303'] = null;
			    						} else {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_303'] = Number(Item['\'FN02_104'+'\''])/Number(Item['\'FN02_204'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 304){
			    						if (Item['\'FN02_205'+'\''] == null || Item['\'FN02_205'+'\''] == 0) {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_304'] = null;
			    						} else {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_304'] = Number(Item['\'FN02_105'+'\''])/Number(Item['\'FN02_205'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 305){
			    						if (Item['\'FN02_206'+'\''] == null || Item['\'FN02_206'+'\''] == 0) {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_305'] = null;
			    						} else {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_305'] = Number(Item['\'FN02_106'+'\''])/Number(Item['\'FN02_206'+'\'']);
			    						}
			    					}else if(item2.C_SCODE == 302){ //요금단가 일반용
			    						if (Item['\'FN02_202'+'\''] == null || Item['\'FN02_202'+'\''] == 0 || Item['\'FN02_203'+'\''] == null || Item['\'FN02_203'+'\''] == 0) {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_302'] = null;
			    						} else {
			    							$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_302'] = Number(Number(Item['\'FN02_102'+'\''])+Number(Item['\'FN02_103'+'\'']))/Number(Number(Item['\'FN02_202'+'\''])+Number(Item['\'FN02_203'+'\'']));
			    						}
			    					}else if(item2.C_SCODE == 300){ //요금단가 합계
			    						$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_300'] = 
			    							Number(Number(Item['\'FN02_301'+'\''])+Number(Item['\'FN02_302'+'\''])+Number(Item['\'FN02_303'+'\''])+Number(Item['\'FN02_304'+'\''])+Number(Item['\'FN02_305'+'\'']));
			    					}else{
				    					$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_'+item2.C_SCODE] = Item['\'FN02_'+item2.C_SCODE+'\''];
			    					}
			    					*/
			    					$scope.OCtabInfo[0].DATA[''+ item1 +'FN02_'+item2.C_SCODE] = Item['\'FN02_'+item2.C_SCODE+'\''];
			    				}	
			    			});
			    		});
			    		$.each($scope.OCtabInfo[1].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.OCtabInfo[1].DATA[''+ item1 +'FN03_'+item2.C_SCODE] = Item['\'FN03_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    		$.each($scope.OCtabInfo[2].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.OCtabInfo[2].DATA[''+ item1 +'FN04_'+item2.C_SCODE] = Item['\'FN04_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    		$.each($scope.OCtabInfo[3].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.OCtabInfo[3].DATA[''+ item1 +'FN05_'+item2.C_SCODE] = Item['\'FN05_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    		$.each($scope.OCtabInfo[4].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(item1==Item.YYYY)
			    				$scope.OCtabInfo[4].DATA[''+ item1 +'FN06_'+item2.C_SCODE] = Item['\'FN06_'+item2.C_SCODE+'\''];	
			    			});
			    		});
			    	});
			    	$scope.PopupFinanceOCDetailList = data;
			    });				
			}
			
			//기타비용관리 급수수익
			$scope.updateFN02Sum = function(year,cost_cd){
				console.log(year,cost_cd);
				
				if($scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20'+cost_cd.substr(2,1)] == 0 || $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20'+cost_cd.substr(2,1)] == null){
					$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30'+cost_cd.substr(2,1)] = 0;
				} else {
					$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30'+cost_cd.substr(2,1)] 
					= parseFloat($scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'10'+cost_cd.substr(2,1)]) / parseFloat($scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20'+cost_cd.substr(2,1)]);
				}
					
				
				$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'100'] = 0;
				$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'200'] = 0;
				$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'300'] = 0;
				
				for(var i=1;i<=6;i++){
					
					if(i==3) continue;
					
					if ($scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'10' + i] == 0 || $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'10' + i] == null){
						$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'10' + i] = 0;
					}else {
						$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'100'] += $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'10' + i];
					}
					if ($scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20' + i] == 0 || $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20' + i] == null){
						$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20' + i] = 0;
					}else {
						$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'200'] += $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20' + i];
					}
					if ($scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30' + i] == 0 || $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30' + i] == null){
						$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30' + i] = 0;
					}else {
						$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'300'] += $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30' + i];
					}
					
//					$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'100'] += $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'10' + i];
//					$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'200'] += $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'20' + i];
//					$scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'300'] += $scope.OCtabInfo[0].DATA[''+ year +'FN02_'+'30' + i];
				}
			}
			
			//기타비용관리 인건비
			$scope.updateFN03Sum = function(year,cost_cd){
				console.log(year,cost_cd);
				
				$scope.OCtabInfo[1].DATA[''+ year +'FN03_'+'00'] = 0;
				for (var i = 1; i <= 5; i++) {
					if($scope.OCtabInfo[1].DATA[''+ year +'FN03_'+'0'+i] == null || $scope.OCtabInfo[1].DATA[''+ year +'FN03_'+'0'+i] == undefined) {
						$scope.OCtabInfo[1].DATA[''+ year +'FN03_'+'0'+i] = 0
					}
					$scope.OCtabInfo[1].DATA[''+ year +'FN03_'+'00'] += $scope.OCtabInfo[1].DATA[''+ year +'FN03_'+'0'+i];
				}
			}
			
			//기타비용관리 운영관리비(1)
			$scope.updateFN04Sum = function(year,cost_cd){
				console.log(year,cost_cd);
				
				$scope.OCtabInfo[2].DATA[''+ year +'FN04_'+'00'] = 0;
				for (var i = 1; i <= 6; i++) {
					if($scope.OCtabInfo[2].DATA[''+ year +'FN04_'+'0'+i] == null || $scope.OCtabInfo[2].DATA[''+ year +'FN04_'+'0'+i] == undefined) {
						$scope.OCtabInfo[2].DATA[''+ year +'FN04_'+'0'+i] = 0
					}
					$scope.OCtabInfo[2].DATA[''+ year +'FN04_'+'00'] += $scope.OCtabInfo[2].DATA[''+ year +'FN04_'+'0'+i];
				}
			}
			
			//기타비용관리 운영관리비(2)
			$scope.updateFN05Sum = function(year,cost_cd){
				console.log(year,cost_cd);
				
				if ($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'103']== null || $scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'103'] == 0) {
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'103'] = null;
				} else {
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'301'] //동력비 단가
					= Math.floor(parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'101']) / parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'103']));
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'302'] //약품비 단가
					= Math.floor(parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'102']) / parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'103']));
				}
				if ($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'203']== null || $scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'203'] == 0) {
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'203'] = null;
				} else {
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'303'] //정수구입비 단가
					= Math.floor(parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'201']) / parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'203']));
				}
				if ($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'204']== null || $scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'204'] == 0) {
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'204'] = null;
				} else {
					$scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'304'] //광역원수구입비 단가
					= Math.floor(parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'202']) / parseFloat($scope.OCtabInfo[3].DATA[''+ year +'FN05_'+'204']));
				}
			}
			
			//기타분석 코드 변환
		    $scope.tabInfo=[{},{},{},{},{}];
	 	    $scope.OCCODE = []; //코드
	 	    $scope.OCNAME = {}; //sub th
	 	    $scope.OCMEMO = {}; //main th
	 	    $scope.tabInfo[0].OCNAME ={}; //급수수익
	 	    $scope.tabInfo[0].OCMEMO ={}; //급수수익
	 	    $scope.tabInfo[0].OCCODE =[]; //급수수익
	 	    $scope.tabInfo[1].OCNAME ={}; //인건비
	 	    $scope.tabInfo[1].OCCODE =[]; //인건비
	 	    $scope.tabInfo[2].OCNAME ={}; //운영관리비(1)
	 	    $scope.tabInfo[2].OCCODE =[]; //운영관리비(1)
	 	    $scope.tabInfo[3].OCNAME ={}; //운영관리비(2)
	 	    $scope.tabInfo[3].OCMEMO ={}; //운영관리비(2)
	 	    $scope.tabInfo[3].OCCODE =[]; //운영관리비(2)
	 	    $scope.tabInfo[4].OCNAME ={}; //지급이자
	 	    $scope.tabInfo[4].OCCODE =[]; //지급이자
	 	    
	 	    //기타분석 코드 변환 (팝업)
		    $scope.OCtabInfo=[{},{},{},{},{}];
	 	    $scope.OCCODE = []; //코드
	 	    $scope.OCNAME = {}; //sub th
	 	    $scope.OCMEMO = {}; //main th
	 	    $scope.OCtabInfo[0].OCNAME ={}; //급수수익
	 	    $scope.OCtabInfo[0].OCMEMO ={}; //급수수익
	 	    $scope.OCtabInfo[0].OCCODE =[]; //급수수익
	 	    $scope.OCtabInfo[1].OCNAME ={}; //인건비
	 	    $scope.OCtabInfo[1].OCCODE =[]; //인건비
	 	    $scope.OCtabInfo[2].OCNAME ={}; //운영관리비(1)
	 	    $scope.OCtabInfo[2].OCCODE =[]; //운영관리비(1)
	 	    $scope.OCtabInfo[3].OCNAME ={}; //운영관리비(2)
	 	    $scope.OCtabInfo[3].OCMEMO ={}; //운영관리비(2)
	 	    $scope.OCtabInfo[3].OCCODE =[]; //운영관리비(2)
	 	    $scope.OCtabInfo[4].OCNAME ={}; //지급이자
	 	    $scope.OCtabInfo[4].OCCODE =[]; //지급이자
	 	    
	 	    //----------------------------급수수익-----------------------------
	 	    
	 	    mainDataService.getCommonCodeList({
	 	    	gcode : 'FN02',
		        gname : ''
	 	    })
	 		.success(function(data){
	 			$scope.LevelInfo = data;
	 			$.each($scope.LevelInfo,function(idx,Item){
	 				$scope.tabInfo[0].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
	 				$scope.tabInfo[0].OCNAME['\'FN02'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.tabInfo[0].OCMEMO['\'FN02'+'_'+Item.C_SCODE+'\'']=Item.C_MEMO;
	 				$scope.OCtabInfo[0].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
	 				$scope.OCtabInfo[0].OCNAME['\'FN02'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.OCtabInfo[0].OCMEMO['\'FN02'+'_'+Item.C_SCODE+'\'']=Item.C_MEMO;
	 			});
	 		});
	 	   
	 	   //----------------------------인건비-----------------------------
	 	    
	 	   mainDataService.getCommonCodeList({
	 	    	gcode : 'FN03',
		        gname : ''
	 	    })
	 		.success(function(data){
	 			$scope.LevelInfo = data;
	 			$.each($scope.LevelInfo,function(idx,Item){
	 				$scope.tabInfo[1].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME});
	 				$scope.tabInfo[1].OCNAME['\'FN03'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.OCtabInfo[1].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME});
	 				$scope.OCtabInfo[1].OCNAME['\'FN03'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 			});
	 		});
	 	   
	 	   //----------------------------운영관리비(1)-----------------------------
	 	   
	 	   mainDataService.getCommonCodeList({
	 	    	gcode : 'FN04',
		        gname : ''
	 	    })
	 		.success(function(data){
	 			$scope.LevelInfo = data;
	 			$.each($scope.LevelInfo,function(idx,Item){
	 				$scope.tabInfo[2].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
	 				$scope.tabInfo[2].OCNAME['\'FN04'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.OCtabInfo[2].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
	 				$scope.OCtabInfo[2].OCNAME['\'FN04'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 			});
	 		});
			
	 	   //----------------------------운영관리비(2)-----------------------------
	 	   
	 	   mainDataService.getCommonCodeList({
	 	    	gcode : 'FN05',
		        gname : ''
	 	    })
	 		.success(function(data){
	 			$scope.LevelInfo = data;
	 			$.each($scope.LevelInfo,function(idx,Item){
	 				$scope.tabInfo[3].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
	 				$scope.tabInfo[3].OCNAME['\'FN05'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.tabInfo[3].OCMEMO['\'FN05'+'_'+Item.C_SCODE+'\'']=Item.C_MEMO;
	 				$scope.OCtabInfo[3].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
	 				$scope.OCtabInfo[3].OCNAME['\'FN05'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.OCtabInfo[3].OCMEMO['\'FN05'+'_'+Item.C_SCODE+'\'']=Item.C_MEMO;
	 			});
	 		});
	 	   
	 	   //----------------------------지급이자-----------------------------
	 	   
	 	   mainDataService.getCommonCodeList({
	 	    	gcode : 'FN06',
		        gname : ''
	 	    })
	 		.success(function(data){
	 			$scope.LevelInfo = data;
	 			$.each($scope.LevelInfo,function(idx,Item){
	 				$scope.tabInfo[4].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME});
	 				$scope.tabInfo[4].OCNAME['\'FN06'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 				$scope.OCtabInfo[4].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME});
	 				$scope.OCtabInfo[4].OCNAME['\'FN06'+'_'+Item.C_SCODE+'\'']=Item.C_NAME;
	 			});
	 		});
			
	 	   // 오늘 날짜로 setting
	 	   function setToday(){
	 	        var today = new Date(); // 오늘
	 	        var eYear = today.getFullYear();
	 	        var e_yyyymmdd = eYear + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
	 	        $scope.PopupFinanceInfo.FIN_ANLS_YMD = e_yyyymmdd; //분석일은 오늘 날짜
	 	        $('#Popup_FIN_ANLS_YMD').val(e_yyyymmdd);
	 	        $scope.PopupFinanceInfo.WRT_YMD = e_yyyymmdd; // 작성일도 오늘 날짜
	 	        $('#Popup_WRT_YMD').val(e_yyyymmdd);
	 	    }
	 	   
			//-------------------재정수지분석 팝업-----------------------
			
		    //신규분석 팝업
		    $scope.ShowFinancialPopup = function () {
		    	//$('#financialplanPopup').show();
		    	$scope.PopupFinanceInfo = angular.copy($scope.SelectedFinanceInfo);
		    	$scope.PopupFinancialList = angular.copy($scope.FinancialList); //각 탭 네임
		    	$scope.PopupselectedTabId = angular.copy($scope.selectedTabId);
		    	//$scope.PopupyearList2 = angular.copy($scope.yearList2);
		    	$scope.PopupFinanceInfo.FIN_ANLS_NM = ''; //분석명
		    	$scope.PopupFinanceInfo.WRTR_NM = ''; //작성자
		    	$scope.PopupFinanceInfo.WRT_YMD = ''; //작성일
		    	$scope.PopupFinanceInfo.FIN_ANLS_YMD = '';	//분석일
		    	$scope.PopupFinanceInfo.PRICE_RAISE_RATIO = '';	//물가상승률
		    	setToday();
		    	$scope.PopuptabClick($scope.PopupselectedTabId);
		    	
		    	mainDataService.insertTempFinancialPlan({
		    	})
		    	.success(function(data){
		    		$scope.PopupFinanceInfo.FIN_ANLS_SID = data.FIN_ANLS_SID;
		    		console.log($scope.PopupFinanceInfo.FIN_ANLS_SID );
		    		//$scope.PopupFinanceInfo.FIN_ANLS_SID = data;
		    		$scope.CleanFinancialPopupInit();// MEMO : 팝업 버튼 클릭시 초기화 함수 실행(5개 예상치 실행)
		    		var param = {};
			    	mainDataService.getFinacePriceRaiseRatio(param)
			    	.success(function(data){
			    		$scope.PopupFinanceInfo.PRICE_RAISE_RATIO = data.PRICE_RAISE_RATIO;
				    	$('#financialplanPopup').show();
			    	});		    		
		    	});
		    };
		    
		    
		    //신규분석 팝업 저장
		    $scope.saveFinancialPopup = function (){
		    	if($scope.PopupFinanceInfo.FIN_ANLS_NM == null || $scope.PopupFinanceInfo.FIN_ANLS_NM ==''){
		    		alertify.alert('','분석명을 입력하세요.');
		    		return false;
		    	}
		    	if($scope.PopupFinanceInfo.FIN_ANLS_YMD == null || $scope.PopupFinanceInfo.FIN_ANLS_YMD == ""){
		    		alertify.alert('','분석일을 입력하세요.');
		    		return false;
		    	}
		    	$("#loadingSpinner").show();
		    	var list = [];
		    	$.each($scope.PopupFinanceDetailList,function(idx,Item){
		    		for(key in Item){
		    			if(Item[key]==null) Item[key]="";
		    			//if (key == 'fin_anls_sid' || key == 'FIN_ANLS_SID') Item[key] = $scope.PopupFinanceInfo.FIN_ANLS_SID; // 임시!!
		    		}
		    		list.push(Item);
		    	});
		    	console.log(list);
		    	//alert($scope.PopupselectedTabId);
		    	var param = {
		    			fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
		    			//fin_anls_type : "",
		    			fin_anls_type : $scope.PopupselectedTabId,
		    			fin_anls_nm : xssFilter($scope.PopupFinanceInfo.FIN_ANLS_NM),
		    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD.replace(/-/gi,''),
		    			price_raise_ratio : $scope.PopupFinanceInfo.PRICE_RAISE_RATIO,
						temp_yn : 'N',
						item_list : list
	    		};
	        	mainDataService.setFinancialPlanDetail(param)
	        	.success(function(data){
	        		$scope.loadList();
	        		$scope.closeFinancialPopup();
	        		$("#loadingSpinner").hide();
	        		alertify.success('저장 되었습니다.');
	        	});
	        	$scope.SelectedFinanceInfo = angular.copy($scope.PopupFinanceInfo);
	        	$scope.FinanceDetailList = angular.copy($scope.PopupFinanceDetailList);
	        	//$scope.yearList2 = angular.copy($scope.PopupyearList2);
	        	console.log($scope.AddListLoanItem);
	        	console.log($scope.AddListLoanItemYear);
	        	$.each($scope.AddListLoanItem,function(idx,Item){
	        		var param = {fin_anls_year: '2022',loan_item_cd:Item,cnt : $scope.AddListLoanItemYear[Item]};
	        		mainDataService.addLoanItemYear(param)
	        		.success(function(data){
	        			
	        		});
	        	});
			    $scope.AddListLoanItem=[];
			    $scope.AddListLoanItemYear={};
		    };
		    
		    
		    //재정수지분석 팝업 각 탭 적용
		    $scope.ApplyFinancialPopup = function(selectedTabId){
		    	//$scope.FinanceDetailList = angular.copy($scope.PopupFinanceDetailList);
		    	var list = [];
		    	console.log($scope.PopupFinanceDetailList);
		    	$.each($scope.PopupFinanceDetailList,function(idx,Item){
		    		for(key in Item){
		    			if(Item[key]==null) Item[key]="";
		    			//if (key == 'fin_anls_sid' || key == 'FIN_ANLS_SID') Item[key] = $scope.PopupFinanceInfo.FIN_ANLS_SID; // 임시!!
		    			//if (key == 'fin_anls_type' || key == 'FIN_ANLS_TYPE') Item[key] = $scope.PopupselectedTabId // 임시!!
		    		}
		    		list.push(Item);
		    	});
		    	console.log(list);
		    	
			    	var param = {
			    			fin_anls_type : selectedTabId,
			    			fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
			    			fin_anls_nm : xssFilter($scope.PopupFinanceInfo.FIN_ANLS_NM),
			    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD.replace(/-/gi,''),
			    			price_raise_ratio : $scope.PopupFinanceInfo.PRICE_RAISE_RATIO,
			    			temp_yn : 'Y',
			    			item_list : list
		    		};
		        	mainDataService.setFinancialPlanDetail(param)
		        	.success(function(data){
		        		//차입금상환/지급이자 텝이면
		        		if(selectedTabId=='FN14'){
		        			mainDataService.getLoanInfo(param)
		        			.success(function(data){
		        				console.log(data);
		        				var tot = {};
		        				$.each($scope.PopupFinanceDetailList,function(idx,Item){
		        					if(Item.LOAN_ITEM_CD =='02')
			        					$.each(data,function(idx1,Item1){
				        					if(Item1.LOAN_ITEM_CD=='01'){
				        						Item['\'' + Item1.YYYY + '\''] = Item1.FEE;
				        						tot['\'' + Item1.YYYY + '\''] = 0;
				        						tot['\'' + Item1.YYYY + '\''] += Item1.FEE;
				        					}
				        				});
		        					
		        					if(Item.LOAN_ITEM_CD =='04')
				        				$.each(data,function(idx1,Item1){
				        					if(Item1.LOAN_ITEM_CD=='03'){
				        						Item['\'' + Item1.YYYY + '\''] = Item1.FEE;
				        						tot['\'' + Item1.YYYY + '\''] += Item1.FEE;
				        					}
				        				});		        					
		        					
		        					if(Item.LOAN_ITEM_CD =='06')
				        				$.each(data,function(idx1,Item1){
				        					if(Item1.LOAN_ITEM_CD=='05'){
				        						Item['\'' + Item1.YYYY + '\''] = Item1.FEE;
				        						tot['\'' + Item1.YYYY + '\''] += Item1.FEE;
				        					}
				        				});
		        					
		        					if(Item.LOAN_ITEM_CD =='08')
				        				$.each(data,function(idx1,Item1){
				        					if(Item1.LOAN_ITEM_CD=='07'){
				        						Item['\'' + Item1.YYYY + '\''] = Item1.FEE;
				        						tot['\'' + Item1.YYYY + '\''] += Item1.FEE;
				        					}
				        				});
		        					
		        					if(Item.LOAN_ITEM_CD =='09')
			        					$.each(data,function(idx1,Item1){
				        					if(Item1.LOAN_ITEM_CD=='01'){
				        						Item['\'' + Item1.YYYY + '\''] = tot['\'' + Item1.YYYY + '\''];
				        					}
				        				});		        					
		        				});
		        			});
		        		}
		        		
		        	});
		        	
		        	console.log($scope.AddListLoanItem);
		        	console.log($scope.AddListLoanItemYear);
		        	$.each($scope.AddListLoanItem,function(idx,Item){
		        		var param = {fin_anls_year: $scope.PopupFinanceInfo.FIN_ANLS_YMD.substring(0,4),loan_item_cd:Item,cnt : $scope.AddListLoanItemYear[Item]};
		        		mainDataService.addLoanItemYear(param)
		        		.success(function(data){
		        			
		        		});
		        	});
				    $scope.AddListLoanItem=[];
				    $scope.AddListLoanItemYear={};

		    };

		    //재정수지분석 팝업 초기화 최초에 한번만
		    $scope.CleanFinancialPopupInit = function(){
//		    	var array = ['FN10','FN11'];
		    	var cnt=0;
		    	var array = ['FN10','FN11','FN12','FN14' ];
		    	for (var i = 0; i < array.length; i++) {
		    		var param = {
			    			fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
			    			fin_anls_type: array[i],
			    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD
			    	};
			    	mainDataService.initFinancialPlanDetailList(param)
			    	.success(function(data){
			    		console.log(data);
			    		cnt++;
			    		if(cnt==array.length)
			    			$rootScope.$broadcast('doFinancialInit', {});
			    		//$scope.PopuptabClick($scope.PopupselectedTabId);
			    	});
		    	}
		    	
		    }
		    
		    //재정수지분석 팝업 초기화
		    $scope.CleanFinancialPopup = function(){
		    	if($scope.PopupselectedTabId=='FN09'){
			    	$rootScope.$broadcast('doFinancialInit', {});
			    	return;		    		
		    	}else if($scope.PopupselectedTabId=='FN10'){//급수수익
		    		var param = {
			    			fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
			    			fin_anls_type: $scope.PopupselectedTabId,
			    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD
			    	};
			    	mainDataService.initFinancialPlanDetailList(param)
			    	.success(function(data){
			    		console.log(data);
			    		$scope.PopuptabClick($scope.PopupselectedTabId);
			    	});		    		
		    	}else if($scope.PopupselectedTabId=='FN11'){//운영비
		    		var param = {
			    			fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
			    			fin_anls_type: $scope.PopupselectedTabId,
			    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD
			    	};
			    	mainDataService.initFinancialPlanDetailList(param)
			    	.success(function(data){
			    		console.log(data);
			    		$scope.PopuptabClick($scope.PopupselectedTabId);
			    	});		    		
		    	}else if($scope.PopupselectedTabId=='FN12'){//감가상각
		    		alertify.alert('Info','초기화',function(){});
		    		var param = {
			    			fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
			    			fin_anls_type: $scope.PopupselectedTabId,
			    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD
			    	};
			    	mainDataService.initFinancialPlanDetailList(param)
			    	.success(function(data){
			    		console.log(data);
			    		$scope.PopuptabClick($scope.PopupselectedTabId);
			    	});			    		
		    	}else if($scope.PopupselectedTabId=='FN14'){//이자
		    		alertify.alert('Info','초기화',function(){});
		    		var param = {
			    			fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
			    			fin_anls_type: $scope.PopupselectedTabId,
			    			fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD
			    	};
			    	mainDataService.initFinancialPlanDetailList(param)
			    	.success(function(data){
			    		console.log(data);
			    		$scope.PopuptabClick($scope.PopupselectedTabId);
			    	});			    		
		    	}

//		    	var param = {
//		    			fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
//		    			fin_anls_type: $scope.PopupselectedTabId
//		    	};
//		    	mainDataService.initFinancialPlanDetailList(param)
//		    	.success(function(data){
//		    		console.log(data);
//		    		$scope.PopuptabClick($scope.PopupselectedTabId);
//		    	});
		    	// MEMO : 초기화 했을 경우 각 텝의 예상치 호출 (5개)
		    };
		    
		    //재정수지분석 팝업 분석
		    $scope.AnalyzeFinancialPopup = function(){
		    	if($scope.PopupFinanceInfo.FIN_ANLS_YMD == null || $scope.PopupFinanceInfo.FIN_ANLS_YMD == ""){
		    		alertify.alert('info','분석일을 입력하세요',function(){});
		    		return false;
		    	}
		    	$("#loadingSpinner").show();
		    	/*
				//$scope.PopupselectedTabId = 'FN09';
				mainDataService.getFinancialPlanDetailList({
					fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
					fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD.replace(/-/gi,''),
					fin_anls_type : 'FN09'
			    }).success(function(data){
			    	$scope.yearChange(); //분석일 기준 이후 30년
			    	var FIN_ANLS_GUBUN_NM = data[0].FIN_ANLS_GUBUN_NM; // 컬럼 이름 맞추기 //rowspan
			 		$scope.GB_ARRAY = new Array(); //array scope안해도됨
			 		$scope.GB_ARRAY.push({name:data[0].FIN_ANLS_GUBUN_NM,cnt:1,idx:0});
			 		$.each(data,function(idx,item){
			 			if(data[idx].FIN_ANLS_GUBUN_NM == FIN_ANLS_GUBUN_NM){
			 				if(idx>0)
		 					$scope.GB_ARRAY[$scope.GB_ARRAY.length-1].cnt +=1;
			 			}
			 			else{
			 				$scope.GB_ARRAY.push({name:data[idx].FIN_ANLS_GUBUN_NM,cnt:1,idx:idx});	 				
			 			}
			 			FIN_ANLS_GUBUN_NM = data[idx].FIN_ANLS_GUBUN_NM;
			 			item.GB_Idx = $scope.GB_ARRAY.length-1;
			 			item.row_idx = $scope.GB_ARRAY[$scope.GB_ARRAY.length-1].idx;
			 			item.idx = idx;
			 		});
			 		$.each(data,function(idx,item){
			 			item.GB_cnt = $scope.GB_ARRAY[item.GB_Idx].cnt; 
			 		});
			    	$scope.PopupFinanceDetailList = data;
			    	$("#loadingSpinner").hide();
			    });*/	
				$timeout(function(){
					var i=0;
					var chkList = [1,2,3,4,5,7,9,12,13,16,17,18,19,20,21,22,23,24,27,28,29,33];
					var firstYear = '';						
					$.each($scope.PopupyearList2,function(idx,Item){
						if(idx==0){
							firstYear = Item;
							$scope.PopupFinanceDetailList[i]['\''+firstYear+'\''] = Math.round(parseInt($scope.PopupFinanceDetailList[i]['\''+firstYear+'\'']));
						}
						if(idx>0){
							for(i=0;i<50;i++){
								if($.inArray(i,chkList)>=0){
									$scope.PopupFinanceDetailList[i]['\''+Item+'\''] = Math.round(parseInt($scope.PopupFinanceDetailList[i]['\''+firstYear+'\'']) * Math.pow((100 + parseFloat($scope.PopupFinanceInfo.PRICE_RAISE_RATIO))/100,idx));	
								}
							}
						}
					});
					$.each($scope.PopupyearList2,function(idx,Item){
						$scope.CalculationFinancial(Item); 
					});
					
					$rootScope.$broadcast('doAnalyze', {});
					
					$("#loadingSpinner").hide();
				},1000);
		    };
		    
		    //신규분석 팝업 닫기
		    $scope.closeFinancialPopup = function () {
		    	$('#financialplanPopup').hide();
		    };

		    //물가상승률 적용
		    $scope.ApplyInflation = function(opt) {
				mainDataService.updateFinancialPlan({
					'fin_anls_sid': $scope.PopupFinanceInfo.FIN_ANLS_SID,
					'price_raise_ratio': $scope.PopupFinanceInfo.PRICE_RAISE_RATIO,
					'fin_anls_dt': $scope.PopupFinanceInfo.FIN_ANLS_YMD,
				}).success(function(data) {
					if(opt==2)
						alertify.success('물가상승률이 적용 되었습니다.');
					else
						alertify.success('분석일이 변경 되었습니다.');
					
					if(opt==1){
						$scope.PopuptabClick($scope.PopupselectedTabId);	
					}
					$timeout(function(){
						var i=0;
						var chkList = [1,2,3,4,5,7,9,12,13,16,17,18,19,20,21,22,23,24,27,28,29,33];
						var firstYear = '';						
						$.each($scope.PopupyearList2,function(idx,Item){
							if(idx==0){
								firstYear = Item;
								$scope.PopupFinanceDetailList[i]['\''+firstYear+'\''] = Math.round(parseFloat($scope.PopupFinanceDetailList[i]['\''+firstYear+'\'']));
							}
							if(idx>0){
								for(i=0;i<50;i++){
									if($.inArray(i,chkList)>=0){
										$scope.PopupFinanceDetailList[i]['\''+Item+'\''] = Math.round(parseFloat($scope.PopupFinanceDetailList[i]['\''+firstYear+'\'']) * Math.pow((100 + parseFloat($scope.PopupFinanceInfo.PRICE_RAISE_RATIO))/100,idx));	
									}
								}
							}
						});						
					},3000);
					
				});
			};	
		    
		    //요금단가 생산량 구입량 설정 팝업 닫기
		    $scope.ClosePriceSettingPopup = function(){
		    	$('#PriceSettingPopup').hide();
		    };
		    
		    //요금단가 생산량 구입량 설정 팝업
		    $scope.ShowPriceSettingPopup = function(){
		    	$('#PriceSettingPopup').show();
		    	
			    $scope.VolumeDetailListInfo=[{}];
		 	    $scope.OCCODE = []; //코드
		 	    $scope.OCNAME = {}; //sub th
		 	    $scope.OCMEMO = {}; //main th
		 	    $scope.VolumeDetailListInfo[0].OCNAME ={}; //요금단가 생산량 구입량
		 	    $scope.VolumeDetailListInfo[0].OCMEMO ={}; //요금단가 생산량 구입량
		 	    $scope.VolumeDetailListInfo[0].OCCODE =[]; //요금단가 생산량 구입량
		    	mainDataService.getCommonCodeList({
		 	    	gcode : 'FN05',
			        gname : ''
		 	    })
		 		.success(function(data){
		 			console.log(data);
		 			$scope.LevelInfo = data;
		 			$.each($scope.LevelInfo,function(idx,Item){
		 				console.log(Item);
		 				if((parseInt(Item.C_SCODE) != 101) && (parseInt(Item.C_SCODE) != 102) && (parseInt(Item.C_SCODE) != 201) && (parseInt(Item.C_SCODE) != 202)){
		 					if(Item.C_MEMO == '동력비/약품비/상수생산량') {
			 					Item.C_MEMO = '생산량/구입량(㎥)';
			 				}else if (Item.C_MEMO == '구입 단가(원/m3)'){
			 					Item.C_MEMO = '비용 단가(원/㎥)';
			 				}
		 					$scope.VolumeDetailListInfo[0].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_MEMO: Item.C_MEMO});
			 				$scope.VolumeDetailListInfo[0].OCNAME['FN05'+'_'+Item.C_SCODE]=Item.C_NAME;
			 				$scope.VolumeDetailListInfo[0].OCMEMO['FN05'+'_'+Item.C_SCODE]=Item.C_MEMO;
		 				};
		 			});
		 			
		 			//데이터 
			    	mainDataService.getUnitPriceAndProductionVolumeAndPurchaseVolumeInfo({
						fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
						fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD.replace(/-/gi,'')
				    }).success(function(data){
				    	$scope.VolumeDetailList = data;
				    	
				    	$scope.VolumeDetailListInfo[0].DATA = {}; //요금단가,생산량,구입량 데이터
				    		$.each($scope.VolumeDetailListInfo[0].OCCODE,function(idx2,item2){
				    			$.each(data,function(idx,Item){
				    				if(idx.indexOf(item2.C_SCODE)>0){
				    					$scope.VolumeDetailListInfo[0].DATA[idx] = Item;
				    				}
				    			});
				    		});
				    	console.log($scope.VolumeDetailListInfo[0].OCCODE);
				    });		 			
		 		});
		    	console.log($scope.VolumeDetailListInfo);
		    };
		    
		    //요금단가 생산량 구입량 설정 저장
		    $scope.SavePriceSettingPopup = function() {
				mainDataService.setFinancialAnalysisChargeUnitPrice({
					fin_anls_sid: $scope.PopupFinanceInfo.FIN_ANLS_SID,
					item: $scope.VolumeDetailListInfo[0].DATA,
				}).success(function(data) {
					alertify.success('저장 되었습니다.');
					$scope.ClosePriceSettingPopup();
				});
			};	
		    
		    //전기말 이자율 설정 팝업 닫기
		    $scope.CloseElectricityInterestRatePopup = function(){
		    	$('#ElectricityInterestRatePopup').hide();
		    };
		    
		    //전기말 이자율 설정  팝업
		    $scope.ShowElectricityInterestRatePopup = function(){
		    	$('#ElectricityInterestRatePopup').show();
		    	
		    	$scope.InterestRateEndOfLastYearDetailListInfo=[{}];
		 	    $scope.OCCODE = []; //코드
		 	    $scope.OCNAME = {}; //sub th
		 	    $scope.OCVALUE = {}; //main th
		 	    
		 	    $scope.InterestRateEndOfLastYearDetailListInfo[0].OCNAME ={}; //전기말 이자율 
		 	    $scope.InterestRateEndOfLastYearDetailListInfo[0].OCCODE =[]; //전기말 이자율 
		    	mainDataService.getCommonCodeList({
		 	    	gcode : 'FN07',
			        gname : ''
		 	    })
		 		.success(function(data){
		 			console.log(data);
		 			$scope.LevelInfo = data;
		 			$.each($scope.LevelInfo,function(idx,Item){
		 				$scope.InterestRateEndOfLastYearDetailListInfo[0].OCCODE.push({C_SCODE: Item.C_SCODE, C_NAME: Item.C_NAME, C_CVALUE1: Item.C_CVALUE1});
		 				$scope.InterestRateEndOfLastYearDetailListInfo[0].OCNAME['FN07'+'_'+Item.C_SCODE]=Item.C_NAME;
		 			});
		 			
			    	//데이터
			    	mainDataService.getInterestRateEndOfLastYearInfo({
						fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
						fin_anls_ymd : $scope.PopupFinanceInfo.FIN_ANLS_YMD.replace(/-/gi,'')
				    }).success(function(data){
				    	$scope.InterestRateEndOfLastYearDetailList = data;
				    	
				    	$scope.InterestRateEndOfLastYearDetailListInfo[0].DATA = {}; //전기말 이자율 데이터
			    		$.each($scope.InterestRateEndOfLastYearDetailListInfo[0].OCCODE,function(idx2,item2){
			    			$.each(data,function(idx,Item){
			    				if(idx.indexOf(item2.C_SCODE)>0){
			    					$scope.InterestRateEndOfLastYearDetailListInfo[0].DATA[idx] = Item;
			    				} // ex)FN07_01
			    			});
			    		});
				    	console.log($scope.InterestRateEndOfLastYearDetailListInfo[0].OCCODE);
				    });
			    	console.log($scope.InterestRateEndOfLastYearDetailListInfo);		 			
		 		});
		    };
		    
		    //전기말 이자율 설정 팝업 저장
		    $scope.SaveElectricityInterestRatePopup = function(){
		    	mainDataService.updateInterestRateEndOfLastYearInfo({
					fin_anls_sid : $scope.PopupFinanceInfo.FIN_ANLS_SID,
					item : $scope.InterestRateEndOfLastYearDetailListInfo[0].DATA
			    }).success(function(data){
			    	alertify.success('저장 되었습니다.');
			    	$scope.CloseElectricityInterestRatePopup();
			    });	
		    };
		    
		    //재정수지총괄 그래프 팝업 
		    $scope.ShowChartFinancial = function(){
		    	$("#ChartFinancial").show();
				mainDataService.getFinancialPlanDetailList({
					fin_anls_sid : $scope.SelectedFinanceInfo.FIN_ANLS_SID,
					fin_anls_type : 'FN09',
			    }).success(function(data){
			    	var list = ['FIN_ANLS_GUBUN_NM','FIN_ANLS_ITEM_CD','FIN_ANLS_ITEM_NM','FIN_ANLS_SID','FIN_ANLS_TYPE','C_GCODE','C_SCODE'];
			    	$scope.yearList2 = [];
			    	$.each(data,function(idx,Item){
						if(idx==0)
						$.each(Item,function(idx2,Item2){
							if($.inArray(idx2,list)<0)
								$scope.yearList2.push(idx2.replace(/'/gi,''));
						});
					});
					$scope.yearList2.sort();
			    	$scope.FinanceDetailListChart = data;
			    	//console.log($scope.FinanceDetailListChart);
			    	$scope.showChartFinancialBalance();
			    	$scope.showChartInflation();
			    });
		    };
		    
		    

			
	    	//---------------------------------재정수지총괄 차트 데이터--------------------------------
	    	$scope.showChartFinancialBalance = function(){
			    var chartData = [];
		    	$.each($scope.FinanceDetailListChart,function(idx,Item){
		    		if(Item.C_SCODE == '703'){ // 자본적수지 과부족액
		    			$.each($scope.yearList2,function(idx2,yyyy){
		    				if($.inArray(idx2,list)<0){
		    					if(Item['\''+yyyy+'\'']==null) Item['\''+yyyy+'\''] = 0; //null일경우 0
		    					if(idx==0) $scope.yearTot[idx2] = 0
								$scope.FinanceDetailListChart[idx2] = parseInt(Item['\''+yyyy+'\'']); //문자열을 숫자로
		    				};
		    			});
		    		};
				});
		    	
				for(var i=0; i<$scope.yearList2.length; i++){
					chartData.push({"YYYY":$scope.yearList2[i], "TOTAL": $scope.FinanceDetailListChart[i]});
				}
				chartFinancialBalance(chartData); // 재정수지총괄차트
				console.log(chartData);
	    	};
		    
		    //---------------------------------요금인상 차트 데이터--------------------------------
		    $scope.showChartInflation = function(){
				// 차트 데이터
				var chartDataInflation = [];
				$scope.inflationListChart = [];
				$.each($scope.FinanceDetailListChart,function(idx,Item){
		    		if( Item.FIN_ANLS_GUBUN_NM == '요금인상' ){ // 요금인상
		    			$.each($scope.yearList2,function(idx2,yyyy){
		    				if($.inArray(idx2,list)<0){
		    					if(Item['\''+yyyy+'\'']==null) Item['\''+yyyy+'\''] = 0; //null일경우 0
								$scope.FinanceDetailListChart[idx2] = parseInt(Item['\''+yyyy+'\'']); //문자열을 숫자로
								if(idx2 == 0){
									//$scope.inflationListChart.push({YYYY:parseInt(Item['\''+yyyy+'\''])})
									Item.YYYY = parseInt(Item['\''+yyyy+'\''])
								}
								if(idx2 == 5){
									//$scope.inflationListChart.push({AFTERYYYY:parseInt(Item['\''+yyyy+'\''])})
									Item.AFTERYYYY = parseInt(Item['\''+yyyy+'\''])
								}
		    				};
		    			});
		    			$scope.inflationListChart.push({NAME:Item.FIN_ANLS_ITEM_NM, YYYY: Item.YYYY, AFTERYYYY:Item.AFTERYYYY});
		    		}
				});
				//console.log($scope.inflationListChart);
				
				for(var i=0; i<$scope.inflationListChart.length; i++){
					chartDataInflation.push({"CATEGORY":$scope.inflationListChart[i].NAME, "YYYY": $scope.inflationListChart[i].YYYY, "AFTERYYYY":$scope.inflationListChart[i].AFTERYYYY});
				};
		    	chartInflation(chartDataInflation); // 요금인상 차트
		    	console.log(chartDataInflation);
		    };

		    //그래프 출력
			 $scope.printChart = function() {
				 //var base64src = document.getElementById('chart1').getSnapshot(); // TODO: id 동적으로!
				 var chartID = 'chart1';
				 if($("#tab1_1_btn_g").hasClass("active")){
					 chartID = 'chart1';
				 }else {
					 chartID = 'chart2';
				 }
				 console.log(chartID);
				 var base64src = document.getElementById(chartID).getSnapshot(); //id 동적으로!

				 var iframe = document.createElement('iframe');
				 var html = 
					 '<body><img src="data:image/png;base64,' + base64src + 
					 '" style="width: 100%; height: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);"></body>';
				 document.body.appendChild(iframe);
				 iframe.contentWindow.document.open();
				 iframe.contentWindow.document.write(html);
				 iframe.contentWindow.document.close();

				 setTimeout(() => {
					 iframe.contentWindow.focus();
					 iframe.contentWindow.print(); // Print.
				}, 800);

				 // FIXME: iframe 프린트 또는 취소 눌렀을 떄 삭제해야 함
				 iframe.contentWindow.addEventListener('afterprint', function() {
					 console.log('After print');

					 iframe.parentNode.removeChild(iframe);
				 });
			 }; 
		    
		    //재정수지총괄 그래프 팝업 닫기
		    $scope.CloseChartFinancial = function(){
		    	$("#ChartFinancial").hide();
		    };
		    
		    //재정수지총괄 그래프 
		    let chartFinancialBalance = function (chartData) {
				// 차트 이름, 차트 영역 id
				rMateChartH5.create("chart1", "chartFinancialBalance", "", "100%", "100%");
				
				var maxValue = Math.max(chartData.TOTAL);

				// 스트링 형식으로 레이아웃 정의.
				var layoutStr =
		             '<rMateChart backgroundColor="#FFFFFF" borderStyle="none">'
		                 +'<Options>'
		                      +'<Caption text="자금수지 과부족액" />'
		                      //+'<Legend useVisibleCheck="true" horizontalGap="0" position="bottom" horizontalScrollPolicy="off"/>'
		                 +'</Options>'
		                 +'<NumberFormatter id="numfmt4" useThousandsSeparator="true"/>'
		                 +'<SeriesInterpolate id="ss"/>'
		                   +'<Column2DChart showDataTips="true" selectionMode="multiple" columnWidthRatio="0.48">'
		                       +'<horizontalAxis>'
		                           +'<CategoryAxis categoryField="YYYY"/>'
		                        +'</horizontalAxis>'
		                      +'<verticalAxis>'
		                         +'<LinearAxis maximum="20000" interval="10"/>'
		                         +'<LinearAxis id="vAxis1" interval="NaN" title="금액(원)" formatter="{numfmt4}"/>'
		                      +'</verticalAxis>'
		                        +'<series>'
		                           +'<Column2DSeries labelPosition="outside" yField="TOTAL" displayName="합계" showDataEffect="{ss}" strokeJsFunction="strokeFunction"/>'
		                       +'</series>'
		                  +'</Column2DChart>'
		               +'</rMateChart>';

				rMateChartH5.calls("chart1", {
					"setLayout" : layoutStr,
					"setData" : chartData
				});
				
				function legendAllCheck(value)
				{
				   document.getElementById("chart1").legendAllCheck(value);
				}
				
				rMateChartH5.registerTheme(rMateChartH5.themes);
				function rMateChartH5ChangeTheme(theme){
				    document.getElementById("chart1").setTheme(theme);
				}
			};
			
			
		    //요금인상 그래프 
			let chartInflation = function(chartDataInflation){
				rMateChartH5.create("chart2", "chartInflation", "", "100%", "100%");

				let year1 = $scope.yearList2[0];
				let year2 = $scope.yearList2[5];
				
				var maxValue = function(){
					if(Math.max(chartDataInflation.YYYY) > Math.max(chartDataInflation.AFTERYYYY)){
						Math.max(chartDataInflation.YYYY);
					}else {
						Math.max(chartDataInflation.AFTERYYYY);
					}	
				}
				var minValue = -maxValue;
				 
				// 스트링 형식으로 레이아웃 정의.
				var layoutStr =
				            '<rMateChart backgroundColor="#FFFFFF" borderStyle="none">'
				               +'<Options>'
				                  +'<Legend defaultMouseOverAction="false" />'
				              +'</Options>'
				              +'<NumberFormatter id="numfmt4" useThousandsSeparator="true"/>'
				             +'<Column2DChart showDataTips="true" columnWidthRatio="0.55" selectionMode="single">'
				                 +'<horizontalAxis>'
				                       +'<CategoryAxis categoryField="CATEGORY"/>'
				                  +'</horizontalAxis>'
				                  +'<verticalAxis>'
				                     +'<LinearAxis maximum="10"/>'
				                     +'<LinearAxis id="vAxis1" maximum="'+maxValue+'" minimum="'+minValue+'" interval="NaN" title="재정수지(백만원)" formatter="{numfmt4}"/>'
				                 +'</verticalAxis>'
				                    +'<series>'
				                       +'<Column2DSeries labelPosition="outside" yField="YYYY" displayName="'+year1+'년">'
				                            +'<showDataEffect>'
				                               +'<SeriesInterpolate/>'
				                           +'</showDataEffect>'
				                      +'</Column2DSeries>'
				                      +'<Column2DSeries labelPosition="outside" yField="AFTERYYYY" displayName="'+year2+'년">'
				                      	+'<fill>'
		                              		+'<SolidColor color="#fabc05"/>'
		                              	+'</fill>'
				                            +'<showDataEffect>'
				                               +'<SeriesInterpolate/>'
				                           +'</showDataEffect>'
				                      +'</Column2DSeries>'
				                  +'</series>'
				              +'</Column2DChart>'
				           +'</rMateChart>';
				 
				 
				rMateChartH5.calls("chart2", {
				    "setLayout" : layoutStr,
				    "setData" : chartDataInflation
				});
				
				rMateChartH5.registerTheme(rMateChartH5.themes);
				
				function rMateChartH5ChangeTheme(theme){
				    document.getElementById("chart2").setTheme(theme);
				}
			};
		    
		    //-------------------재무재표 팝업-----------------------
		    
		    //재무재표BS 신규 팝업
		    $scope.NewBSPopup = function(){
		    	$("#BSPopup").show();
		    	$scope.AddYearCount = 0;
		    	$scope.PopupFinancialBSList = angular.copy($scope.FinancialBSList);
		    	$scope.PopupFinanceInfo = angular.copy($scope.SelectedFinanceInfo);
		    	$scope.PopupComCodeYearList2 = angular.copy($scope.ComCodeYearList2);
		    	setToday();
		    };
		    
		    //재무재표(BS) 총계
			$scope.updateBSSum = function(yyyy){
				var indexOfSum1;
				var indexOfSum2;
				var indexOfSum3;
				var indexOfSum4;
				$.each($scope.PopupFinancialBSList, function (idx, item) {
					if (item.ACCOUNT_NM !== undefined) {
						if(item.ACCOUNT_NM == "자산총계") {
							indexOfSum1 = idx;
						}
						if(item.ACCOUNT_NM == "부채총계") {
							indexOfSum2 = idx;
						}
						if(item.ACCOUNT_NM == "자본총계") {
							indexOfSum3 = idx;
						}
						if(item.ACCOUNT_NM == "부채와자본총계") {
							indexOfSum4 = idx;
						}
					}
					if (item.ACCOUNT_CD !== undefined) {
						if(item.ACCOUNT_CD == "1100000") { //유동자산
							indexOfSum1100000 = idx;
						}
						if(item.ACCOUNT_CD == "1200000") { //비유동자산
							indexOfSum1200000 = idx;
						}
						if(item.ACCOUNT_CD == "2100000") { //유동부채
							indexOfSum2100000 = idx;
						}
						if(item.ACCOUNT_CD == "2200000") { //비유동부채
							indexOfSum2200000 = idx;
						}
						if(item.ACCOUNT_CD == "3100000") { //자본금
							indexOfSum3100000 = idx;
						}
						if(item.ACCOUNT_CD == "3200000") { //자본잉여금
							indexOfSum3200000 = idx;
						}
						if(item.ACCOUNT_CD == "3300000") { //결손금
							indexOfSum3300000 = idx;
						}
					}
				});
				
				//연도별합계
				$.each($scope.PopupComCodeYearList2, function(idx2, yyyy) {
					
					$scope.PopupFinancialBSList[indexOfSum1]['\'' + yyyy.C_SCODE + '\''] = 0;
					$scope.PopupFinancialBSList[indexOfSum2]['\'' + yyyy.C_SCODE + '\''] = 0;
					$scope.PopupFinancialBSList[indexOfSum3]['\'' + yyyy.C_SCODE + '\''] = 0;
					$scope.PopupFinancialBSList[indexOfSum4]['\'' + yyyy.C_SCODE + '\''] = 0;
					
					/*$.each($scope.PopupFinancialBSList, function(Idx, item) {
						if(Idx < indexOfSum1){ // 자산총계
							$scope.PopupFinancialBSList[indexOfSum1]['\'' + yyyy.C_SCODE + '\''] += $scope.PopupFinancialBSList[Idx]['\'' + yyyy.C_SCODE + '\''];
						} else if (indexOfSum1 < Idx && Idx < indexOfSum2){ // 부채총계
							$scope.PopupFinancialBSList[indexOfSum2]['\'' + yyyy.C_SCODE + '\''] += $scope.PopupFinancialBSList[Idx]['\'' + yyyy.C_SCODE + '\''];
						} else if (indexOfSum2 < Idx && Idx < indexOfSum3){ // 자본총계
							$scope.PopupFinancialBSList[indexOfSum3]['\'' + yyyy.C_SCODE + '\''] += $scope.PopupFinancialBSList[Idx]['\'' + yyyy.C_SCODE + '\''];
						} else {
							 $scope.PopupFinancialBSList[Idx]['\'' + yyyy.C_SCODE + '\''] = $scope.PopupFinancialBSList[Idx]['\'' + yyyy.C_SCODE + '\''];
						}
					});*/
					
					//자산총계
					$scope.PopupFinancialBSList[indexOfSum1]['\'' + yyyy.C_SCODE + '\''] = 
						$scope.PopupFinancialBSList[indexOfSum1100000]['\'' + yyyy.C_SCODE + '\''] + $scope.PopupFinancialBSList[indexOfSum1200000]['\'' + yyyy.C_SCODE + '\''];
					//부채총계
					$scope.PopupFinancialBSList[indexOfSum2]['\'' + yyyy.C_SCODE + '\''] = 
						$scope.PopupFinancialBSList[indexOfSum2100000]['\'' + yyyy.C_SCODE + '\''] + $scope.PopupFinancialBSList[indexOfSum2200000]['\'' + yyyy.C_SCODE + '\''];
					//자본총계
					$scope.PopupFinancialBSList[indexOfSum3]['\'' + yyyy.C_SCODE + '\''] = 
						$scope.PopupFinancialBSList[indexOfSum3100000]['\'' + yyyy.C_SCODE + '\''] + $scope.PopupFinancialBSList[indexOfSum3200000]['\'' + yyyy.C_SCODE + '\''] + $scope.PopupFinancialBSList[indexOfSum3300000]['\'' + yyyy.C_SCODE + '\''];
					//부채와자본총계
					$scope.PopupFinancialBSList[indexOfSum4]['\'' + yyyy.C_SCODE + '\''] = 
						$scope.PopupFinancialBSList[indexOfSum2]['\'' + yyyy.C_SCODE + '\''] + $scope.PopupFinancialBSList[indexOfSum3]['\'' + yyyy.C_SCODE + '\''];
				});
			}
		   
		    
		    //재무재표BS 팝업 저장
		    $scope.SaveBSPopup = function(){
		    	var list = [];
		    	var Scope = angular.element(document.getElementById('bsPopup')).scope();
	    		$.each(Scope.PopupFinancialBSList,function(idx,Item){
	    			for(key in Item){
	        			if(Item[key]==null) Item[key]="";
	        		}
	    			list.push(Item);
	    		});
	    		var param ={
	    				item_list : list
	    		};
	        	mainDataService.setFinancialStatement(param)
	        	.success(function(data){
	        		alertify.success('저장 되었습니다.');
	        		$scope.loadList();
	        		$scope.CloseBSPopup();
	        		location.reload(true);
	        	});	        	
		    	$scope.ComCodeYearList2 = angular.copy($scope.PopupComCodeYearList2);
		    	$scope.SelectedFinanceInfo = angular.copy($scope.PopupFinanceInfo);
		    	$scope.FinancialBSList = angular.copy(Scope.PopupFinancialBSList);
		    	$scope.saveAddYear();//연도 저장
		    };
		    
		    //재무재표BS 팝업 결과등록
		    $scope.ApplyBSPopup = function(){
		    	
		    };
		    
		    $scope.AddYearCount = 0;
		    //연도추가
		    $scope.AddYear = function(){
	    	    //$scope.yearList2.push((Number($scope.yearList2[$scope.yearList2.length - 1])+1).toString());
	    	    //console.log($scope.yearList2);
		    	$scope.PopupComCodeYearList2.unshift({
		    		C_MEMO : $scope.PopupComCodeYearList2[0].C_MEMO,
		    		C_SCODE: (Number($scope.PopupComCodeYearList2[0].C_SCODE)+1).toString(),
		    		C_NAME: (Number($scope.PopupComCodeYearList2[0].C_NAME)+1).toString()
		    		});
		    	console.log($scope.PopupComCodeYearList2);
		    	$scope.AddYearCount += 1;
		    	console.log($scope.AddYearCount);
		    };
		    
		    //연도 추가 저장
		    $scope.saveAddYear = function(){
		    	var param = {cnt : $scope.AddYearCount};
		    	mainDataService.addComCodeListYr2(param)
		    	.success(function(data){
		    		$scope.reloadComCodeYearList2();
		    		$scope.AddYearCount = 0;
		    	});
		    };
		    
		    //재무재표 팝업 닫기
		    $scope.CloseBSPopup = function(){
		    	$("#BSPopup").hide();
		    };
		    
		    //-------------------손익계산서 팝업-----------------------
		    
		    //손익계산서 신규 팝업
		    $scope.NewPLPopup = function(){
		    	$("#PLPopup").show();
		    	$scope.AddYearCount = 0;
		    	$scope.PopupFinancialPLList = angular.copy($scope.FinancialPLList);
		    	$scope.PopupFinanceInfo = angular.copy($scope.SelectedFinanceInfo);
		    	$scope.PopupComCodeYearList2 = angular.copy($scope.ComCodeYearList2);
		    	setToday();
		    };
		    
		    
		    //손익계산서 팝업 저장
		    $scope.SavePLPopup = function(){
		    	var list = [];
		    	var Scope = angular.element(document.getElementById('plPopup')).scope();
	    		$.each(Scope.PopupFinancialPLList,function(idx,Item){
	    			for(key in Item){
	        			if(Item[key]==null) Item[key]="";
	        		}
	    			list.push(Item);
	    		});
	    		var param ={
	    				item_list : list
	    		};
	        	mainDataService.setIncomeStatement(param)
	        	.success(function(data){
	        		alertify.success('저장 되었습니다.');
	        		$scope.loadList();
	        		$scope.ClosePLPopup();
	        		location.reload(true);
	        	});
		    	$scope.ComCodeYearList2 = angular.copy($scope.PopupComCodeYearList2);
		    	$scope.SelectedFinanceInfo = angular.copy($scope.PopupFinanceInfo);
		    	$scope.FinancialPLList = angular.copy(Scope.PopupFinancialPLList);
		    	$scope.saveAddYear();//연도 저장
		    };
		    
		    //손익계산서 팝업 닫기
		    $scope.ClosePLPopup = function(){
		    	$("#PLPopup").hide();
		    };
		    
		    //-------------------현금흐름표 팝업-----------------------
		    
		    //현금흐름표 신규 팝업
		    $scope.NewCFPopup = function(){
		    	$("#CFPopup").show();
		    	$scope.AddYearCount = 0;
		    	$scope.PopupFinancialCFList = angular.copy($scope.FinancialCFList);
		    	$scope.PopupFinanceInfo = angular.copy($scope.SelectedFinanceInfo);
		    	$scope.PopupComCodeYearList2 = angular.copy($scope.ComCodeYearList2);
		    	setToday();
		    };
		    
		    
		    //현금흐름표 팝업 저장
		    $scope.SaveCFPopup = function(){
		    	var list = [];
		    	var Scope = angular.element(document.getElementById('cfPopup')).scope();
	    		$.each(Scope.PopupFinancialCFList,function(idx,Item){
	    			for(key in Item){
	        			if(Item[key]==null) Item[key]="";
	        		}
	    			list.push(Item);
	    		});
	    		var param ={
	    				item_list : list
	    		};
	        	mainDataService.setCashFlowStatement(param)
	        	.success(function(data){
	        		alertify.success('저장 되었습니다.');
	        		$scope.loadList();
	        		$scope.CloseCFPopup();
	        		location.reload(true);
	        	});
		    	$scope.ComCodeYearList2 = angular.copy($scope.PopupComCodeYearList2);
		    	$scope.SelectedFinanceInfo = angular.copy($scope.PopupFinanceInfo);
		    	$scope.FinancialCFList = angular.copy(Scope.PopupFinancialCFList);
		    	$scope.saveAddYear();//연도 저장
		    };
		    
		    //현금흐름표 팝업 닫기
		    $scope.CloseCFPopup = function(){
		    	$("#CFPopup").hide();
		    };
		    
		    
		    //-------------------기타비용 팝업-----------------------
		    
		    //기타비용 신규 팝업
		    $scope.NewOCPopup = function(){
		    	$("#OCPopup").show();
		    	$scope.AddYearCount = 0;
		    	$scope.PopupFinanceInfo = angular.copy($scope.SelectedFinanceInfo);
		    	//$scope.PopupFinanceOCDetailList = angular.copy($scope.FinanceOCDetailList);
		    	$scope.PopupFinancialOCList = angular.copy($scope.FinancialOCList);
		    	$scope.OCPopupselectedTabId = angular.copy($scope.OCselectedTabId);
		    	$scope.PopupComCodeYearList2 = angular.copy($scope.ComCodeYearList2);

		    	var scope = angular.element($('#ocPopup')).scope();
		    	if($scope.OCPopupselectedTabId == 'FN02'){
		    		scope.OCPopuptabClick('02');
		    	}else if($scope.OCPopupselectedTabId == 'FN03'){
		    		scope.OCPopuptabClick('03');
		    	}else if($scope.OCPopupselectedTabId == 'FN04'){
		    		scope.OCPopuptabClick('04');
		    	}else if($scope.OCPopupselectedTabId == 'FN05'){
		    		scope.OCPopuptabClick('05');
		    	}else{
		    		scope.OCPopuptabClick('06');
		    	}
		    	
		    	//scope.OCPopuptabClick('02');
		    	setToday();
		    };
		    
		    
		    //기타비용 팝업 저장
		    $scope.SaveOCPopup = function(){
		    	
		    	var list = [];
		    	if($scope.OCPopupselectedTabId == 'FN02'){ //급수수익
		    		var yearList = [];
		    		var i = 0;
		    		console.log($scope.OCtabInfo[0].DATA);
		    		$.each($scope.OCtabInfo[0].DATA,function(idx,Item){
		    			var year = idx.substr(0,4);
		    			if($.inArray(year,yearList)<0){
		    				yearList.push(year);
		    				var item = {'YYYY':year};
		    				item[''+ idx.substr(4)] = Item;
		    				list.push(item);
		    				i++;
		    			}else{
		    				list[i-1][''+ idx.substr(4)] = Item;
		    			}
		    		});		    		
		    	}else if ($scope.OCPopupselectedTabId == 'FN03'){ //인건비
		    		var yearList = [];
		    		var i = 0;
		    		console.log($scope.OCtabInfo[1].DATA);
		    		$.each($scope.OCtabInfo[1].DATA,function(idx,Item){
		    			var year = idx.substr(0,4);
		    			if($.inArray(year,yearList)<0){
		    				yearList.push(year);
		    				var item = {'YYYY':year};
		    				item[''+ idx.substr(4)] = Item;
		    				list.push(item);
		    				i++;
		    			}else{
		    				list[i-1][''+ idx.substr(4)] = Item;
		    			}
		    		});			    		
		    	}else if ($scope.OCPopupselectedTabId == 'FN04'){ //운영관리비(1)
		    		var yearList = [];
		    		var i = 0;
		    		console.log($scope.OCtabInfo[2].DATA);
		    		$.each($scope.OCtabInfo[2].DATA,function(idx,Item){
		    			var year = idx.substr(0,4);
		    			if($.inArray(year,yearList)<0){
		    				yearList.push(year);
		    				var item = {'YYYY':year};
		    				item[''+ idx.substr(4)] = Item;
		    				list.push(item);
		    				i++;
		    			}else{
		    				list[i-1][''+ idx.substr(4)] = Item;
		    			}
		    		});			    		
		    	}else if ($scope.OCPopupselectedTabId == 'FN05'){ //운영관리비(2)
		    		var yearList = [];
		    		var i = 0;
		    		console.log($scope.OCtabInfo[3].DATA);
		    		$.each($scope.OCtabInfo[3].DATA,function(idx,Item){
		    			var year = idx.substr(0,4);
		    			if($.inArray(year,yearList)<0){
		    				yearList.push(year);
		    				var item = {'YYYY':year};
		    				item[''+ idx.substr(4)] = Item;
		    				list.push(item);
		    				i++;
		    			}else{
		    				list[i-1][''+ idx.substr(4)] = Item;
		    			}
		    			
		    		});		    		
		    	}else {	//지급이자
		    		console.log($scope.OCtabInfo[4].DATA);
		    		$.each($scope.OCtabInfo[4].DATA,function(idx,Item){
		    			var item = {'YYYY':idx.substr(0,4)};
		    				item[''+ idx.substr(4)] = Item;
		    			list.push(item);
		    		});
		    	};
	    		var param = {
	    			item_list : list 
	    		};
	        	mainDataService.setOtherCostManagement(param)
	        	.success(function(data){
	        		$scope.loadList();
	        		$("#OCPopup").hide();
	        		console.log(list);
	        		alertify.success('저장 되었습니다.');
	        		location.reload(true);
	        	});
	        	$scope.ComCodeYearList2 = angular.copy($scope.PopupComCodeYearList2);
	        	$scope.SelectedFinanceInfo = angular.copy($scope.PopupFinanceInfo);
		    	$scope.FinanceOCDetailList = angular.copy($scope.PopupFinanceOCDetailList);
		    	$scope.FinancialOCList = angular.copy($scope.PopupFinancialOCList);
		    	$scope.saveAddYear();//연도 저장
		    };
		    
		    //기타비용 팝업 닫기
		    $scope.CloseOCPopup = function(){
		    	$("#OCPopup").hide();
		    };
		    
		    //차입금상환이자 행추가
		    $scope.AddListLoanItem=[];
		    $scope.AddListLoanItemYear={};
		    
		    $scope.AddLoanItemYear = function(){
		    	list = []; 
		    	$.each($scope.PopupFinanceDetailList,function(idx,Item){
		    		var item = angular.copy(Item);
		    		if(Item.LOAN_ITEM_CD == $scope.SelectedLoanItem.LOAN_ITEM_CD){
		    			if(Item.LOAN_ITEM_YEAR!='0000') item.GB_cnt = item.GB_cnt + 1;
		    		}
		    		list.push(item);
		    		if(Item.LOAN_ITEM_YEAR=='0000') return;
		    		//선택 항목의 최대년도 값이면 뒤로년도를 하나 추가한다
		    		if(Item.LOAN_ITEM_CD == $scope.SelectedLoanItem.LOAN_ITEM_CD && Item.LOAN_ITEM_YEAR == $scope.SelectedLoanItem.maxYear ) {
		    			var newYear = angular.copy(Item);
		    			newYear.LOAN_ITEM_YEAR = '' + (parseInt(newYear.LOAN_ITEM_YEAR) + 1); 
		    			list.push(newYear);
		    			$scope.SelectedLoanItem.maxYear = ''+ ( parseInt($scope.SelectedLoanItem.maxYear) + 1);
		    		} 
		    	}); 
		    	$scope.PopupFinanceDetailList = list;
		    	
		    	if($.inArray($scope.SelectedLoanItem.LOAN_ITEM_CD,$scope.AddListLoanItem)<0){
		    		$scope.AddListLoanItem.push($scope.SelectedLoanItem.LOAN_ITEM_CD);
		    		$scope.AddListLoanItemYear[$scope.SelectedLoanItem.LOAN_ITEM_CD] = 1;
		    	}else{
		    		$scope.AddListLoanItemYear[$scope.SelectedLoanItem.LOAN_ITEM_CD] += 1;
		    	}
		    	
		    }
		    
		    $scope.selectLoanItem = function(selectedLoanItem){
		    	$scope.SelectedLoanItem = angular.copy(selectedLoanItem);
		    	//선택된 항목의 최대년도 탐색
		    	$scope.SelectedLoanItem.maxYear = '0000';
		    	$.each($scope.PopupFinanceDetailList,function(idx,Item){
		    		if(Item.LOAN_ITEM_CD == $scope.SelectedLoanItem.LOAN_ITEM_CD) {
		    		if($scope.SelectedLoanItem.maxYear < Item.LOAN_ITEM_YEAR)
		    			$scope.SelectedLoanItem.maxYear = Item.LOAN_ITEM_YEAR;
		    		}
		    	});
		    }
		    
		    $scope.dataExportToExcel = function(obj,code,gcode){
		    	//alert('양식출력');
		    	//alert(JSON.stringify(obj));
		    	//alert(JSON.stringify(code));
		    	
		    	var colIndex = [{name:'순번',id:'NUM'}];
		    	if(typeof code=='undefined'){
		    		colIndex.push({name:'항목코드',id:'ACCOUNT_CD'});
		    		colIndex.push({name:'항목그룹',id:'ACCOUNT_GROUP_NM'});
	    			colIndex.push({name:'항목명',id:'ACCOUNT_NM'});			
		    		var list = angular.copy($scope.ComCodeYearList2);
			    	list.sort(function(a,b){return (a.C_SCODE > b.C_SCODE)?1:-1;});
			    	$.each(list,function(idx,Item){
			    		var item = {name : '\''+Item.C_SCODE+'\'' ,id:'\''+Item.C_SCODE+'\''};
			    		colIndex.push(item);
			    	});		    		
		    	}else{
					colIndex.push({name:'년도',id:'YYYY'});
		    		$.each(code,function(idx,Item){
			    		var item = {name : ''+Item.C_NAME+'' ,id:'\'' + gcode +'_'+ Item.C_SCODE+'\''};
			    		colIndex.push(item);		    			
		    		});
		    		obj.reverse();
		    	}
		    	
		    	
		    	
		    	var rows = [];
        		$.each(obj,function(idx,Item){
        			var collumns = [];
        			if(idx==0){
        				var headers = [];				
        				$.each(colIndex,function(idx1,item){
        						headers.push(item.id);
        				});
        				rows.push(headers);
        			}
        			if(idx==0){
        				var headers = [];				
        				$.each(colIndex,function(idx1,item){
        						headers.push(item.name);
        				});
        				rows.push(headers);
        			}        			
        			$.each(colIndex,function(idx1,item){
        				collumns.push(Item[item.id]);
        			});
        			rows.push(collumns);
        		});
		    	
        		const workSheetData = rows;
        		const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
        		//workSheet['!autofilter'] = {ref : "A1:R11"};
        		const workBook = XLSX.utils.book_new();
        		XLSX.utils.book_append_sheet(workBook, workSheet, '양식출력');
        		XLSX.writeFile(workBook, 'itemlist.xlsx');
		    	
		    	return;
		    }
		    
		    $scope.dataImportFromExcel = function(obj,code,gcode){
		    	//alert('양식입력');
		    	//alert(JSON.stringify(obj));
		    	
		    	$rootScope.FN_OBJ = obj;
		    	if(typeof code == 'undefined'){
		    		$rootScope.FN_GCODE = null;
		    		$rootScope.FN_CODE_LIST = null;
		    	}else{
		    		$rootScope.FN_GCODE = gcode;
		    		$rootScope.FN_CODE_LIST = code;	
		    	}
		    	$("#input_excel_file").trigger('click');
		    	return;
		    }
		    
		    $scope.getExcelDownload = function(){
		    	let jobType = $state.current.name+ "_" + 1;
				Common_Excel.ExcelDown(jobType, {});
		    }
		    
		    $scope.fileSelect = function($files, cmd, index){ 			
		       	var reader = new FileReader();
		    		reader.onload = function(e) {
		    			const workBook =XLSX.read(reader.result, {type :'binary'});
		    			workBook.SheetNames.forEach(sheetName => {
		    				const rows =XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
		    				//rows.splice(0,1);
		    				//console.log(rows);
		    				console.log(rows);
		    				if(sheetName=='양식출력'){
		    					
		    					var list = [];  
		    					$.each(rows,function(idx,Item){
		    						if(idx<1) return;
		    						list.push(Item);
		    					});
		    					
		    					if($scope.FN_GCODE){
		    						$scope.PopupFinanceOCDetailList = list;
		    					}else{
		    						switch(rows[1].ACCOUNT_CD){
		    						case '5000000' : 
		    							var Scope = angular.element(document.getElementById('cfPopup')).scope();
		    							Scope.PopupFinancialCFList = list;
		    							break; //CF
		    						case '4000000' :
		    							var Scope = angular.element(document.getElementById('plPopup')).scope();
		    							Scope.PopupFinancialPLList = list; 
		    							break; //PL
		    						case '1000000' :
		    							var Scope = angular.element(document.getElementById('bsPopup')).scope();
		    							Scope.PopupFinancialBSList = list; 
		    							break; //BS
		    						default : 
		    							break;
		    						}
		    					}
		    						


		    					if($rootScope.FN_GCODE){
		    						var Scope = angular.element(document.getElementById('ocPopup')).scope();
		    						
			    					console.log($scope.PopupFinanceOCDetailList);
			    					
			    					Scope.OCtabInfo[0].DATA = {};
			    					Scope.OCtabInfo[1].DATA = {};
			    					Scope.OCtabInfo[2].DATA = {};
			    					Scope.OCtabInfo[3].DATA = {};
			    					Scope.OCtabInfo[4].DATA = {};		    					
			    					var yearList = [];
			    					$.each($scope.ComCodeYearList2,function(idx,Item){
			    						yearList.push(Item.C_SCODE);
			    					});
			    					
			    					
		    					var data = $scope.PopupFinanceOCDetailList;
		    					//alert($scope.FN_GCODE);
		    			    	$.each(yearList,function(idx1,item1){
		    			    		if($rootScope.FN_GCODE=='FN02')
		    			    		$.each(Scope.OCtabInfo[0].OCCODE,function(idx2,item2){
		    			    			$.each(data,function(idx,Item){
		    			    				if(item1==Item.YYYY){
		    			    					Scope.OCtabInfo[0].DATA[''+ item1 +'FN02_'+item2.C_SCODE] = Item['\'FN02_'+item2.C_SCODE+'\''];
		    			    				}	
		    			    			});
		    			    		});
		    			    		if($rootScope.FN_GCODE=='FN03')
		    			    		$.each(Scope.OCtabInfo[1].OCCODE,function(idx2,item2){
		    			    			$.each(data,function(idx,Item){
		    			    				if(item1==Item.YYYY)
		    			    					Scope.OCtabInfo[1].DATA[''+ item1 +'FN03_'+item2.C_SCODE] = Item['\'FN03_'+item2.C_SCODE+'\''];	
		    			    			});
		    			    		});
		    			    		if($rootScope.FN_GCODE=='FN04')
		    			    		$.each(Scope.OCtabInfo[2].OCCODE,function(idx2,item2){
		    			    			$.each(data,function(idx,Item){
		    			    				if(item1==Item.YYYY)
		    			    					Scope.OCtabInfo[2].DATA[''+ item1 +'FN04_'+item2.C_SCODE] = Item['\'FN04_'+item2.C_SCODE+'\''];	
		    			    			});
		    			    		});
		    			    		if($rootScope.FN_GCODE=='FN05')
		    			    		$.each(Scope.OCtabInfo[3].OCCODE,function(idx2,item2){
		    			    			$.each(data,function(idx,Item){
		    			    				if(item1==Item.YYYY)
		    			    					Scope.OCtabInfo[3].DATA[''+ item1 +'FN05_'+item2.C_SCODE] = Item['\'FN05_'+item2.C_SCODE+'\''];	
		    			    			});
		    			    		});
		    			    		if($rootScope.FN_GCODE=='FN06')
		    			    		$.each(Scope.OCtabInfo[4].OCCODE,function(idx2,item2){
		    			    			$.each(data,function(idx,Item){
		    			    				if(item1==Item.YYYY)
		    			    					Scope.OCtabInfo[4].DATA[''+ item1 +'FN06_'+item2.C_SCODE] = Item['\'FN06_'+item2.C_SCODE+'\''];	
		    			    			});
		    			    		});
		    			    	});
		    					}
		    					Scope.$apply();
					
		    				}
		    				//mainDataService.CommunicationRelay(PopupView.URLS.InsertAsset, {List : rows, SID : PopupView.Info.Popup_SID}).success(function(sInfo) {
		    					//Common_Swap.B_A(sInfo, Model.condition);
		    					//$('#'+ Model.grid_id).jqGrid('setGridParam', {postData : Model.condition, page : 1}).trigger('reloadGrid');	
		    				//});
		    			});
		    		};
		    		reader.readAsBinaryString($files[0]);
		    	}
}