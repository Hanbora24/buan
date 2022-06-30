angular.module('app.asset').controller('assetController', assetController);
angular.module('app.asset').controller('assetStandardController', assetStandardController);

function assetStandardController($scope, $state, $stateParams, mainDataService, $rootScope, $compile, $timeout, $interval, ConfigService, YearSet, GridConfig, FixedAssetItem) {
  $scope.$on('$viewContentLoaded', function() {
    //setGrid();
    gridResize();
    setDatePicker();
    $rootScope.setBtnAuth($scope.MCODE);
  });
  $scope.MCODE = '1508';
  $scope.SelectedAssetBaseInfo = {};
  $scope.asset_base_sid = '';
  $scope.EditAssetBaseInfo = {};
  //$scope.signStore = ["1등급","2등급","3등급","4등급","5등급","6등급","7등급","8등급","9등급","10등급"];
  console.log($rootScope.LevelName);

  function setGrid() {

    var MyGrid = pagerJsonGrid({
      grid_id: 'list',
      pager_id: 'listPager',
      url: '/asset/getAssetBaseInfoList.json',
      width: 1800,
      condition: {
        page: 1,
        rows: GridConfig.sizeL,
        temp_yn: 'N',
        del_yn: 'N',
        FN_GBN: $scope.SearchFN_GBN || '',
        WORK_GBN: $scope.SearchWORK_GBN || '',
        ASSET_GBN1: $scope.SearchASSET_GBN1 || '',
        STATE_CD: $scope.SearchSTATE_CD || ''
      },
      rowNum: 17,
      //cmTemplate: {sortable: false},
      colNames: [
        '순번',
        '',
        '자산구분',
        '공종',
        '자산구분',
        '공종',
        '자산대그룹',
        '자산소그룹',
        '자산대그룹h',
        '자산소그룹h',
        '코드',
        '생성여부',
        '적용방법',
        '최소수명',
        '최대수명',
        '적용여부',
        '근거',
        '적용여부',
        '적용여부',
        '적용여부',
        '상태평가방법',
        '적용여부',
        '파괴심각도',
        '여용률',
        '인력',
        '시설',
        '운영',
        '서비스',
        '환경',
        '재정',
        'BRE',
        '사용율',
        '등록자',
        '등록일',
        '수정자',
        '수정일'
      ],
      colModel: [
        { name: 'RNUM', width: 40, height: 50 },
        { name: 'BASE_SID', width: 0, hidden: true },
        {
          name: 'FN_GBN_NM', width: 50, formatter: function(value, e, row) {
            return getLevelName(row.FN_GBN, 3);
          }
        },
        {
          name: 'WORK_GBN_NM', width: 50, formatter: function(value, e, row) {
            var Idx = 0;
            if (!(row.BASE_SID > 0)) {
              return '';
            }
            $.each($scope.WorkAssetCode, function(idx, item) {
              if (item.CD == row.WORK_GBN) {
                Idx = idx;
              }
            });
            return $scope.WorkAssetCode[Idx]['NAME'];
          }
        },
        { name: 'FN_GBN', width: 40, hidden: true },
        { name: 'WORK_GBN', width: 40, hidden: true },
        {
          name: 'ASSET_GBN1_NM', width: 120, formatter: function(value, e, row) {
            var Idx = 0;
            if (!(row.BASE_SID > 0)) {
              return '';
            }
            $.each($scope.BigAssetCode, function(idx, item) {
              if (item.CD == row.ASSET_GBN1) {
                Idx = idx;
              }
            });
            return $scope.BigAssetCode[Idx]['NAME'];
          }
        },
        {
          name: 'ASSET_GBN2_NM', width: 200, formatter: function(value, e, row) {
            var Idx = 0;
            if (!(row.BASE_SID > 0)) {
              return '';
            }
            $.each($scope.SmallAssetCode, function(idx, item) {
              if (item.CD == row.ASSET_GBN2) {
                Idx = idx;
              }
            });
            return $scope.SmallAssetCode[Idx]['NAME'];
          }
        },
        { name: 'ASSET_GBN1', width: 100, hidden: true },
        { name: 'ASSET_GBN2', width: 100, hidden: true },
        { name: 'ASSET_CD', width: 150 },
        /*
        { name : 'ASSET_CD', width : 50, formatter:function(value,e,row){
          var Idx = 0;
          if(!(row.BASE_SID > 0)){
            return "";
          }
          $.each ($scope.AssetCode, function(idx,item){
            if(item.CD == row.ASSET_GBN1){
              Idx = idx;
            }
          });
          return $scope.AssetCode[Idx]["PATH_CD"];}
        },*/ //코드
        {
          name: 'STATE_CD', width: 50, edittype: 'select', formatter: 'select', editoptions: {
            value: '01:Y;02:N'
          }
        },
        { name: 'LIFE_CD', width: 50, hidden: false, edittype: 'select', formatter: 'select', editoptions: { value: '01:평균;02:구간;03:최소;04:최대' } },
        { name: 'LIFE_MIN', width: 50, hidden: false },
        { name: 'LIFE_MAX', width: 50, hidden: false },
        { name: 'FAILURE_CD1', width: 50, edittype: 'select', formatter: 'select', editoptions: { value: 'Y:적용;N:비적용' } },
        { name: 'REFERENCE', width: 50 },
        { name: 'FAILURE_CD2', width: 50, hidden: false, edittype: 'select', formatter: 'select', editoptions: { value: 'Y:적용;N:비적용' } },
        { name: 'FAILURE_CD3', width: 50, hidden: false, edittype: 'select', formatter: 'select', editoptions: { value: 'Y:적용;N:비적용' } },
        { name: 'FAILURE_CD4', width: 50, hidden: false, edittype: 'select', formatter: 'select', editoptions: { value: 'Y:적용;N:비적용' } },
        {
          name: 'STATE_EVAL_METHOD_CD',
          width: 100,
          hidden: false,
          edittype: 'select',
          formatter: 'select',
          editoptions: { value: '0:CAP0;1:CAP1단순;2:CAP1다중;3:CAP2;4:CAP3' }
        },
        { name: 'FAILURE_CD5', width: 50, hidden: false, edittype: 'select', formatter: 'select', editoptions: { value: 'Y:적용;N:비적용' } },
        { name: 'RISK_SEVIOR_CD', width: 50, hidden: false },
        { name: 'SPARE_RATIO', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_LOS1', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_LOS2', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_LOS3', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_LOS4', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_LOS5', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_LOS6', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_BRE_POINT', width: 50, hidden: false },
        { name: 'RPN_WEIGHT_USE_RATIO', width: 50, hidden: false },
        { name: 'INSERT_ID', width: 80, hidden: false },
        { name: 'INSERT_DT', width: 80, hidden: false },
        { name: 'UPDATE_ID', width: 80, hidden: false },
        { name: 'UPDATE_DT', width: 80, hidden: false }
      ],
      onSelectRow: function(rowid, status, e) {
        $scope.SelectedAssetBaseInfo = $('#list').jqGrid('getRowData', rowid);
        if (parseInt($scope.SelectedAssetBaseInfo.BASE_SID) > 0) {
          $scope.asset_base_sid = $scope.SelectedAssetBaseInfo.BASE_SID;
          $scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS_SUM =
              Number($scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS1) +
              Number($scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS2) +
              Number($scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS3) +
              Number($scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS4) +
              Number($scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS5) +
              Number($scope.SelectedAssetBaseInfo.RPN_WEIGHT_LOS6);
        }
        $scope.$apply();
      },
      gridComplete: function() {
        var ids = $(this).jqGrid('getDataIDs');
        $(this).setSelection(ids[0]);
        $scope.currentPageNo = $('#list').getGridParam('page');
        $scope.count = $('#list').getGridParam('records');
        $scope.$apply();

        /*head_groups("#list", [
            {caption: 'Test 1', col: 'num', span: 2},
            {caption: 'Result', col: 'sta', span: 3},
            {caption: 'Bla bla bla', col: 'bl2', span: 2}
        ]);*/
      }
    });

    //MyGrid.jqGrid('setGroupHeaders',{
    //useColSpanStyle: true,
    //groupHeaders: [
    /*		        	 {startColumnName: 'RNUM', numberOfColumns: 1, titleText: 'AAAAA'},
                   //{startColumnName: 'BASE_SID', numberOfColumns: 1, titleText: 'AAAAAAA'},
                   {startColumnName: 'FN_GBN_NM', numberOfColumns: 1, titleText: 'AAAA'},
                   {startColumnName: 'WORK_GBN_NM', numberOfColumns: 1, titleText: 'AAAAA'},
                   //{startColumnName: 'FN_GBN', numberOfColumns: 1, titleText: ''},
                   //{startColumnName: 'WORK_GBN', numberOfColumns: 1, titleText: ''},
                   {startColumnName: 'ASSET_GBN1_NM', numberOfColumns: 1, titleText: 'AAAA'},
                   {startColumnName: 'ASSET_GBN2_NM', numberOfColumns: 1, titleText: 'AAAAAA'},
                   //{startColumnName: 'ASSET_GBN1', numberOfColumns: 1, titleText: ''},
                   //{startColumnName: 'ASSET_GBN1', numberOfColumns: 1, titleText: ''},
                   //{startColumnName: 'ASSET_CD', numberOfColumns: 1, titleText: ''},
                   {startColumnName: 'STATE_CD', numberOfColumns: 1, titleText: 'AAAAAAA'},*/
    /*		             {startColumnName: 'LIFE_CD', numberOfColumns: 3, titleText: '내구연한'},
                     {startColumnName: 'FAILURE_CD1', numberOfColumns: 2, titleText: '규제수명'},
                     {startColumnName: 'FAILURE_CD2', numberOfColumns: 1, titleText: '용량수명'},
                     {startColumnName: 'FAILURE_CD3', numberOfColumns: 1, titleText: '서비스수명'},
                     {startColumnName: 'FAILURE_CD4', numberOfColumns: 2, titleText: '물리적수명'},
                     {startColumnName: 'FAILURE_CD5', numberOfColumns: 1, titleText: '경제적수명'},*/
    /*		             {startColumnName: 'RISK_SEVIOR_CD', numberOfColumns: 1, titleText: 'AAAA'},
                     {startColumnName: 'SPARE_RATIO', numberOfColumns: 1, titleText: 'AAAAA'},*/
    //		             {startColumnName: 'RPN_WEIGHT_LOS1', numberOfColumns: 6, titleText: '최적투자 계획수립 LOS연관성'},
    /*{startColumnName: 'INSERT_ID', numberOfColumns: 1, titleText: 'AAAA'},
    {startColumnName: 'INSERT_DT', numberOfColumns: 1, titleText: 'AAAA'},
    {startColumnName: 'UPDATE_ID', numberOfColumns: 1, titleText: 'AAAA'},
    {startColumnName: 'UPDATE_DT', numberOfColumns: 1, titleText: 'AAAA'},*/
    //],
    //});
    gridResize();
    return MyGrid;
  }

  $timeout(function() {
    $('#list').jqGrid('setGroupHeaders', {
      useColSpanStyle: true,
      groupHeaders: [
        { startColumnName: 'LIFE_CD', numberOfColumns: 3, titleText: '내구연한' },
        { startColumnName: 'FAILURE_CD1', numberOfColumns: 2, titleText: '규제수명' },
        { startColumnName: 'FAILURE_CD2', numberOfColumns: 1, titleText: '용량수명' },
        { startColumnName: 'FAILURE_CD3', numberOfColumns: 1, titleText: '서비스수명' },
        { startColumnName: 'FAILURE_CD4', numberOfColumns: 2, titleText: '물리적수명' },
        { startColumnName: 'FAILURE_CD5', numberOfColumns: 1, titleText: '경제적수명' },
        { startColumnName: 'RPN_WEIGHT_LOS1', numberOfColumns: 6, titleText: '최적투자 계획수립 LOS연관성' }

      ]
    });
  }, 1000);

  $scope.loadList = function() {
    $('#list').setGridParam({
      datatype: 'json',
      page: $scope.currentPageNo,
      postData: {}
    }).trigger('reloadGrid', {
      current: true
    });
  };

  $scope.initSearch = function(level) {
    console.log(level);
    if (level < 2) {
      $scope.SearchWORK_GBN = '';
    }
    if (level < 3) {
      $scope.SearchAsset_GBN1 = '';
    }
  };

  //조회하기
  $scope.search = function() {
    $('#list').jqGrid('setGridParam', {
      postData: {
        page: $scope.currentPageNo,
        rows: GridConfig.sizeL,
        FN_GBN: $scope.SearchFN_GBN || '',
        WORK_GBN: $scope.SearchWORK_GBN || '',
        ASSET_GBN1: $scope.SearchAsset_GBN1 || '',
        STATE_CD: $scope.SearchSTATE_CD || ''
      }
    }).trigger('reloadGrid', [{ page: 1 }]);
  };

  // 엑셀 파일 생성 및 다운로드. index.html에서 exportForm에 검색 대상을 지정해야 함
  $scope.getExcelDownload = function() {
    const jobType = '010005';
    const levelStep = $scope.levelStep;
    const levelNm = $scope.levelNm;
    const fn = $scope.fn;

    $('#exportForm').find('[name=jobType]').val(jobType);
    $('#exportForm').find('#levelStep').val(levelStep);
    $('#exportForm').find('#levelNm').val(levelNm);
    $('#exportForm').find('#fn').val(fn);
    $('#exportForm').submit();
  };

  //코드가져오기
  function getLevelName(LEVEL_CD, level) {
    //let LEVEL_CD = pathCd.split('_')[level-1];
    //return $rootScope.LevelName['' + (level - 1) + '_' + LEVEL_CD];
    var Idx = 0;
    var List = [];
    var result = '';
    switch (level) {
      case 3:
        List = [{ CD: 'F', NAME: '시설' }, { CD: 'N', NAME: '관망' }];
        break;
      case 7:
        List = $scope.BigAssetCode;
        break;
      case 8:
        List = $scope.SmallAssetCode;
        break;
      case 6:
        List = $scope.WorkAssetCode;
        break;
      default:
        break;
    }
    $.each(List, function(idx, item) {
      if (item.CD == LEVEL_CD) {
        Idx = idx;
        result = item.NAME;
      }
    });
    return result;
  }

  $scope.getLevelName1 = getLevelName;

  //옵션
  $scope.BigAssetCode = [];
  $scope.SmallAssetCode = [];
  $scope.WorkAssetCode = [];
  $scope.AssetCode = [];

  mainDataService.getAssetLevelList({}).success(function(data) {
    console.log(data);
    $scope.AseetLevelInfo = data;
    $.each($scope.AseetLevelInfo, function(idx, Item) {
      //$rootScope.LevelName[''+(Item.LEVEL_STEP -1) +'_'+ Item.LEVEL_CD] = Item.LEVEL_NM;
      if (Item.FN_CD == 'F' && Item.LEVEL_STEP == 7) {
        $scope.BigAssetCode.push({
          FN_CD: Item.FN_CD,
          CD: Item.LEVEL_CD,
          NAME: Item.LEVEL_NM,
          P_LEVEL_STEP: Item.P_LEVEL_STEP,
          P_CLASS_CD: Item.P_CLASS_CD
        });
      }
      if (Item.FN_CD == 'N' && Item.LEVEL_STEP == 6) {
        $scope.BigAssetCode.push({
          FN_CD: Item.FN_CD,
          CD: Item.LEVEL_CD,
          NAME: Item.LEVEL_NM,
          P_LEVEL_STEP: Item.P_LEVEL_STEP,
          P_CLASS_CD: Item.P_CLASS_CD
        });
      }
      if (Item.FN_CD == 'F' && Item.LEVEL_STEP == 8) {
        $scope.SmallAssetCode.push({
          FN_CD: Item.FN_CD,
          CD: Item.LEVEL_CD,
          NAME: Item.LEVEL_NM,
          P_LEVEL_STEP: Item.P_LEVEL_STEP,
          P_CLASS_CD: Item.P_CLASS_CD
        });
      }
      if (Item.FN_CD == 'N' && Item.LEVEL_STEP == 7) {
        $scope.SmallAssetCode.push({
          FN_CD: Item.FN_CD,
          CD: Item.LEVEL_CD,
          NAME: Item.LEVEL_NM,
          P_LEVEL_STEP: Item.P_LEVEL_STEP,
          P_CLASS_CD: Item.P_CLASS_CD
        });
      }
      if (Item.FN_CD == 'F' && Item.LEVEL_STEP == 6) {
        $scope.WorkAssetCode.push({
          FN_CD: Item.FN_CD,
          CD: Item.LEVEL_CD,
          NAME: Item.LEVEL_NM,
          P_LEVEL_STEP: Item.P_LEVEL_STEP,
          P_CLASS_CD: Item.P_CLASS_CD
        });
      }
      if (Item.FN_CD == 'N' && Item.LEVEL_STEP == 5) {
        $scope.WorkAssetCode.push({
          FN_CD: Item.FN_CD,
          CD: Item.LEVEL_CD,
          NAME: Item.LEVEL_NM,
          P_LEVEL_STEP: Item.P_LEVEL_STEP,
          P_CLASS_CD: Item.P_CLASS_CD
        });
      }
      $scope.AssetCode.push({ FN_CD: Item.FN_CD, CD: Item.LEVEL_CD, NAME: Item.LEVEL_NM, PATH_CD: Item.PATH_CD });

    });
    setGrid();

  });

  //물리적수명 적용 여부에 따라 상태평가 방법 활성화 여부
  $('#check05_2_p').on('click', function() {
    $('select[name=statusEvaluation]').attr('disabled', true);
  });
  $('#check05_1_p').on('click', function() {
    $('select[name=statusEvaluation]').attr('disabled', false);
  });

  //내구연한 적용방법 중 수명범위 적용시 최소수명,최대수명 비활성화
  $('#check01_2_p').on('click', function() {
    $('#popup_life_min').attr('disabled', true);
    $('#popup_life_max').attr('disabled', true);
  });
  $('#check01_1_p,#check01_3_p,#check01_4_p').on('click', function() {
    $('#popup_life_min').attr('disabled', false);
    $('#popup_life_max').attr('disabled', false);
  });

  $scope.LosSumFunction = function() {
    $scope.EditAssetBaseInfo.RPN_WEIGHT_LOS_SUM =
        Number($scope.EditAssetBaseInfo.RPN_WEIGHT_LOS1) +
        Number($scope.EditAssetBaseInfo.RPN_WEIGHT_LOS2) +
        Number($scope.EditAssetBaseInfo.RPN_WEIGHT_LOS3) +
        Number($scope.EditAssetBaseInfo.RPN_WEIGHT_LOS4) +
        Number($scope.EditAssetBaseInfo.RPN_WEIGHT_LOS5) +
        Number($scope.EditAssetBaseInfo.RPN_WEIGHT_LOS6);
  };

  //팝업 보기
  $scope.ShowEditAssetBasePopup = function() {
    if ($scope.SelectedAssetBaseInfo.BASE_SID == '' || $scope.SelectedAssetBaseInfo.BASE_SID == undefined) {
      alertify.alert('', '항목을 선택해주세요.');
      return;
    }
    $('#EditAssetBasePopup').show();
    console.log($scope.EditAssetBaseInfo);
    $scope.EditAssetBaseInfo = angular.copy($scope.SelectedAssetBaseInfo);
  };

  //팝업 닫기
  $scope.CloseEditAssetBasePopup = function() {
    $('#EditAssetBasePopup').hide();
  };

  //팝업 내용 저장
  $scope.SaveEditAssetBasePopup = function() {
    $('select[name=statusEvaluation]').change(function() {
      //console.log($("select[name=statusEvaluation] option:selected").text());
      $('#statusEvaluation').val($('select[name=statusEvaluation] option:selected').text());
    });
    var param = angular.copy($scope.EditAssetBaseInfo);
    param.base_sid = $scope.EditAssetBaseInfo.BASE_SID;
    param.reference = $scope.EditAssetBaseInfo.REFERENCE;
    param.temp_yn = 'N';
    $scope.SelectedAssetBaseInfo = angular.copy($scope.EditAssetBaseInfo);
    //$scope.AssetBaseInfo = angular.copy($scope.AssetBaseInfoEdit);
    if ($scope.EditAssetBaseInfo.SPARE_RATIO == '' || $scope.EditAssetBaseInfo.FN_GBN == '' || $scope.EditAssetBaseInfo.WORK_GBN == '' || $scope.EditAssetBaseInfo.ASSET_GBN1 == '' || $scope.EditAssetBaseInfo.ASSET_GBN2 == '' || $scope.EditAssetBaseInfo.STATE_CD == '') { //필수항목을 입력하지 않았을때
      alertify.alert('', '필수항목을 입력하세요.');
      return;
    }
    $scope.EditAssetBaseInfo.SPARE_RATIO = Number($scope.EditAssetBaseInfo.SPARE_RATIO);
    if ($scope.EditAssetBaseInfo.SPARE_RATIO < 0.01 || $scope.EditAssetBaseInfo.SPARE_RATIO > 1) { // 여용률 조건에 맞지 않는 값을 입력했을때
      alertify.alert('', '비정상 자료입니다.');
      return;
    }
    if ($scope.EditAssetBaseInfo.LIFE_MIN == '' || $scope.EditAssetBaseInfo.LIFE_MAX == '') { // 최소수명,최대수명을 입력하지 않았을때
      alertify.alert('', '수명을 입력하세요.');
      return;
    }
    if ($scope.EditAssetBaseInfo.LIFE_MIN > $scope.EditAssetBaseInfo.LIFE_MAX) { // 최소수명,최대수명을 입력하지 않았을때
      alertify.alert('', '수명범위를 확인하세요.');
      return;
    }
    //console.log($scope.EditAssetBaseInfo.SPARE_RATIO);
    mainDataService.updateAssetBase(param).success(function(data) {
      $scope.CloseEditAssetBasePopup();
      $scope.loadList();
      alertify.success('수정되었습니다.');
      //alertify.alert('저장되었습니다.');
      return;
    });
  };
}

function assetController($scope, $state, $stateParams, mainDataService, $rootScope, $compile, $timeout, $interval, ConfigService, YearSet, GridConfig, FixedAssetItem) {
  $scope.LevelInfo = {}; // 레벨 코드 (화면)
  $scope.LevelInfoModal = {}; // 레벨 코드 (팝업창)
  $scope.LevelInfoModal.FN_CD = 'F'; // 시설(F) 또는 관망(N) 여부
  $scope.isDisabled = true; // 화면에서 라디오 버튼 기능 막기
  $scope.isFN = false; // 시설/관망 선택 가능한 레벨인지 체크
  $scope.MaxLevel = 15; // 전체 최대 레벨
  $scope.assetCriteria = []; // 시설/관망 분기점
  $scope.LevelF = []; // 시설 레벨 정보
  $scope.LevelN = []; // 관망 레벨 정보
  $scope.blockF = false; // 시설 최대 레벨 초과 시 막음
  $scope.blockN = false; // 관망 최대 레벨 초과 시 막음
  $scope.fn = ''; // 엑셀
  $scope.levelNm = ''; // 엑셀
  $scope.MCODE = '0002';

  // 전체 최대 레벨(15)과 시설/관망 분기점 레벨(3) 가져오기
  $scope.getAssetCriteria = function() {
    mainDataService.getAssetCriteria().success(function(obj) {
      $scope.assetCriteria = obj;
    });
  };

  // 시설/관망 자산의 선택 가능한 레벨 정보
  $scope.getAssetMaxLevelList = function() {
    mainDataService.getAssetMaxLevelList().success(function(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].FN_CD === 'F') {
          $scope.LevelF.push(obj[i]);
        } else {
          $scope.LevelN.push(obj[i]);
        }
      }
    });
  };

  $scope.$on('$viewContentLoaded', function() {
    setGrid();
    gridResize();
    $rootScope.setBtnAuth($scope.MCODE);
  });

  // 레벨명 검색 시 Enter 키를 입력하면 검색되도록 설정
  $scope.onKeyPress = function(event) {
    if (event.key === 'Enter') {
      $scope.searchLevelCode();
    }
  };

  // 그리드에서 검색 조건에 따른 레벨 코드 목록 보여주기
  $scope.searchLevelCode = function() {
    $('#list').jqGrid('setGridParam', {
      postData: {
        page: $scope.currentPageNo,
        rows: GridConfig.sizeL,
        fn: $scope.fn || '',
        levelStep: $scope.levelStep || '',
        levelNm: $scope.levelNm || ''
      }
    }).trigger('reloadGrid');
    /*
    mainDataService.getLevelCodeTotalCount().success(function(obj) {
        $scope.count = obj;
    });
    */
  };

  // 그리드에 레벨 컬럼에 "레벨" 문자열 추가
  function formatLevelNum(val) {
    let result;

    if (typeof val == 'undefined' || val == null) {
      result = '';
    } else {
      result = '레벨' + val;
    }

    return result;
  }

  // LEVEL_STEP에 추가했던 "레벨" 문자열 빼기
  function unformatLevelNum(val) {
    return val.substr(2);
  }

  function setGrid() {
    return pagerJsonGrid({
      grid_id: 'list',
      pager_id: 'listPager',
      url: '/asset/getLevelCodeList.json',
      condition: {
        page: 1,
        rows: GridConfig.sizeL,
        fn: $scope.FN_CD || '',
        levelStep: $scope.levelStep || '',
        levelNm: $scope.levelNm || ''
      },
      rowNum: 18,
      colNames: ['순번', '레벨', '레벨설정코드', '레벨명칭', '자산분류코드', '시설/관망', '생성일', '작성자', '수정 작성자', '수정일', 'P_LEVEL_STEP', 'P_CLASS_CD', 'PATH_CD'],
      colModel: [
        {
          name: 'RNUM',
          width: 53
        }, {
          name: 'LEVEL_STEP',
          width: 131,
          formatter: formatLevelNum
        }, {
          name: 'LEVEL_CD',
          width: 131
        }, {
          name: 'LEVEL_NM',
          width: 143
        }, {
          name: 'CLASS_CD',
          width: 143
        }, {
          name: 'FN_CD',
          width: 143,
          edittype: 'select',
          formatter: 'select',
          editoptions: { value: 'F:시설;N:관망' }
        }, {
          name: 'INSERT_DT',
          width: 143
        }, {
          name: 'INSERT_ID',
          width: 143
        }, {
          name: 'UPDATE_ID',
          hidden: true
        }, {
          name: 'UPDATE_DT',
          hidden: true
        }, {
          name: 'P_LEVEL_STEP',
          hidden: true
        }, {
          name: 'P_CLASS_CD',
          hidden: true
        }, {
          name: 'PATH_CD',
          hidden: true
        }
      ],

      // 컬럼 선택 시 레벨 코드 정보 보여주기
      onSelectRow: function(id) {
        $scope.LevelInfo = $('#list').jqGrid('getRowData', id);
        $scope.$apply('LevelInfo');
      }
      ,
      gridComplete: function() {
        var ids = $(this).jqGrid('getDataIDs');

        if ($.isEmptyObject($scope.LevelInfo)) {
          $(this).setSelection(ids[0]);
        } else {
          var rowData = $(this).jqGrid('getRowData');

          for (var i = 0; i < rowData.length; i++) {
            if (rowData[i].LEVEL_CD == $scope.LevelInfo.LEVEL_CD) {
              $(this).setSelection(ids[i]);
              break;
            }
          }
        }

        $scope.currentPageNo = $('#list').getGridParam('page');
        $scope.count = $('#list').getGridParam('records');
        if ($('#list').jqGrid('getRowData', ids[0]).RNUM == '') {
          $scope.count = 0;
        }
        $scope.$apply();
      }
    });
  }

  // 엑셀 파일 생성 및 다운로드. index.html에서 exportForm에 검색 대상을 지정해야 함
  $scope.getExcelDownload = function() {
    const jobType = '010003';
    const levelStep = $scope.levelStep;
    const levelNm = $scope.levelNm;
    const fn = $scope.fn;

    $('#exportForm').find('[name=jobType]').val(jobType);
    $('#exportForm').find('#levelStep').val(levelStep);
    $('#exportForm').find('#levelNm').val(levelNm);
    $('#exportForm').find('#fn').val(fn);
    $('#exportForm').submit();
  };

  // 레벨 코드 신규 모달창
  $scope.showNewLevelCodeModal = function() {

    $scope.saveMode = 'new';

    // levelCodePopUp.html의 scope를 가져와서 사용
    //$scope.LevelInfoModal = angular.copy($scope.LevelInfo);
    $scope.LevelInfoModal = {};
    $scope.LevelInfoModal.isNew = true;

    $('#dialog_asset_level_code').show();
  };

  // 레벨 코드 수정 모달창
  $scope.showEditLevelCodeModal = function() {
    if (angular.equals({}, $scope.LevelInfo)) {
      alertify.alert('', '수정할 레벨 코드를 선택해주세요.');
      return false;
    }
    $scope.saveMode = '';

    // 그리드 설정 때 변경된 LEVEL_STEP 데이터를 다시 숫자로 리셋
    //$scope.LevelInfo.LEVEL_STEP = unformatLevelNum($scope.LevelInfo.LEVEL_STEP);
    //$scope.LevelInfo.isNew = false;
    $scope.isFN = true;
    $scope.blockF = true;
    $scope.blockN = true;

    $scope.LevelInfoModal = angular.copy($scope.LevelInfo);
    $scope.LevelInfoModal.isNew = false;
    $scope.LevelInfoModal.LEVEL_STEP = unformatLevelNum($scope.LevelInfo.LEVEL_STEP);
    $scope.isFN = angular.copy($scope.isFN);
    $scope.blockF = angular.copy($scope.blockF);
    $scope.blockN = angular.copy($scope.blockN);

    // $scope.LevelInfo = {};
    $('#dialog_asset_level_code').show();
  };

  // 모달창 닫기
  $scope.closeLevelModal = function() {
    $scope.LevelInfoModal = {};
    $scope.isFN = false;
    // $scope.LevelInfo = {};

    $('#dialog_asset_level_code').hide();
  };
  $scope.levelCd_length = '';
  $scope.displayAssetCodeLength = function() {
    var idx = $scope.LevelInfoModal.LEVEL_STEP - 1;
    if (idx >= $scope.LevelF.length && $scope.LevelInfoModal.FN_CD == 'F') {
      $scope.levelCd_length = '시설레벨' + $scope.LevelF.length + '/' + '관망레벨' + $scope.LevelN.length;
      return;
    }
    if (idx >= $scope.LevelN.length && $scope.LevelInfoModal.FN_CD == 'N') {
      $scope.levelCd_length = '시설레벨' + $scope.LevelF.length + '/' + '관망레벨' + $scope.LevelN.length;
      return;
    }
    console.log($scope.LevelInfoModal.LEVEL_STEP);
    console.log($scope.LevelInfoModal.FN_CD);
    if ($scope.LevelInfoModal.FN_CD == 'F') {
      console.log($scope.LevelF[idx].CD_LEN);
      $scope.levelCd_length = '자산분류코드는 ' + $scope.LevelF[idx].CD_LEN + '자로 입력하세요';
    } else if ($scope.LevelInfoModal.FN_CD == 'N') {
      console.log($scope.LevelN[idx].CD_LEN);
      $scope.levelCd_length = '자산분류코드는 ' + $scope.LevelN[idx].CD_LEN + '자로 입력하세요';
    } else if (idx >= $scope.assetCriteria.FN_NUM) {
      console.log('미확정');
      $scope.levelCd_length = '시설/관망 구분을 설정하세요';
    } else {
      $scope.levelCd_length = '자산분류코드는 ' + $scope.LevelN[idx].CD_LEN + '자로 입력하세요';
      console.log($scope.LevelN[idx].CD_LEN);
    }

  };
  // 시설/관망 선택이 가능한 레벨인지 체크
  $scope.checkFN = function(item) {
    if (item.LEVEL_STEP > $scope.assetCriteria.FN_NUM) {
      $scope.isFN = true;
      $scope.checkMaxLevel(item.LEVEL_STEP);
    } else {
      $scope.isFN = false;
      $scope.LevelInfoModal.FN_CD = '';
    }
    $scope.displayAssetCodeLength();
  };

  // 시설/관망 최대 레벨보다 높은 레벨 선택한 경우 라디오 버튼 disabled로 막기
  $scope.checkMaxLevel = function(LEVEL) {
    let maxLevel;

    $scope.blockF = false;
    $scope.blockN = false;

    maxLevel = $scope.LevelF.length;
    if (maxLevel < LEVEL) {
      $scope.blockF = true;
    }

    maxLevel = $scope.LevelN.length;
    if (maxLevel < LEVEL) {
      $scope.blockN = true;
    }
    $scope.displayAssetCodeLength();
  };

  // 레벨 별 자산분류코드 길이 확인
  $scope.checkLength = function() {
    $scope.makePathCd($scope.LevelInfoModal);
    let classCd = $scope.LevelInfoModal.CLASS_CD;
    if (classCd.length > 10) {
      alertify.alert('', '자산 분류 코드 길이는 최대 10자리입니다.');
      classCd = classCd.substr(0, 10);
      $scope.LevelInfoModal.CLASS_CD = angular.copy(classCd);
      return false;
    }
  };

  // 레벨 코드 validation check
  $scope.validationCheck = function() {
    let len;
    $scope.LevelInfoModal.LEVEL_NM = xssFilter($scope.LevelInfoModal.LEVEL_NM);
    $scope.LevelInfoModal.CLASS_CD = xssFilter($scope.LevelInfoModal.CLASS_CD);
    let item = angular.copy($scope.LevelInfoModal);
    const FN = item.FN_CD;
    const idx = item.LEVEL_STEP - 1;
    item.USER_ID = sessionStorage.getItem('loginId');

    // 1. 모든 정보를 기입했는지 확인
    if (!item.LEVEL_STEP) {
      alertify.alert('', '레벨을 선택해주세요.');
      return false;
    }

    if (item.LEVEL_STEP > 3 && !item.FN_CD) {
      alertify.alert('', '시설/관망 유무를 선택해주세요.');
      return false;
    }

    if (!item.LEVEL_NM) {
      alertify.alert('', '레벨명을 입력해주세요.');
      return false;
    }

    if (!item.CLASS_CD) {
      alertify.alert('', '자산 분류 코드를 입력해주세요.');
      return false;
    }

    // 2. 시설과 관망 모두 최대 레벨 초과라 disabled인 경우
    if ($scope.blockF && $scope.blockN && $scope.isNew) {
      alertify.alert('', '다른 레벨을 선택해주세요.');
      return false;
    }

    // 3. 선택한 최대 레벨과 시설/관망 사용 가능 여부 확인
    switch (FN) {
      case 'F' :
        const lenF = $scope.LevelF.length;
        if (lenF < idx + 1) {
          alertify.alert('', '해당 레벨은 시설에서 사용할 수 없습니다.');
          return false;
        } else {
          len = $scope.LevelF[idx].CD_LEN;
        }
        break;
      case 'N' :
        const lenN = $scope.LevelN.length;
        if (lenN < idx + 1) {
          alertify.alert('', '해당 레벨은 관망에서 사용할 수 없습니다.');
          return false;
        } else {
          len = $scope.LevelN[idx].CD_LEN;
        }
        break;
      default :
        len = $scope.LevelF[idx].CD_LEN; // 시설/관망은 분기점 전까지 같은 자리수를 가지므로 아무 값이나 사용
    }

    // 4. 레벨별 코드 자릿수 확인
    if (item.CLASS_CD.length !== len) {
      alertify.alert('', '자산 분류 코드 자릿수가 맞지 않습니다. 길이는 ' + len + '자리가 되야 합니다.');
      return false;
    }

    // 5. 중복되는 자산 분류 코드인지 확인
    mainDataService.isAssetClassCdExists(item).success(function(obj) {
      if (obj === 1) {
        alertify.alert('', '이미 존재하는 자산 분류 코드입니다. 다른 값으로 시도해주세요.');
        return false;
      } else {
        // 6. 신규 또는 수정 로직으로 이동
        if (item.isNew) {
          $scope.insertNewLevelCode(item);
        } else {
          $scope.updateLevelCode(item);
        }
      }
    });
  };

  $scope.AssetLevelList = [];

  function updateAssetLevelList() {
    mainDataService.getAssetLevelList({}).success(function(data) {
      console.log(data);
      $scope.AssetLevelList = data;
      $.each(data, function(idx, Item) {
        $rootScope.LevelName['' + (Item.LEVEL_STEP - 1) + '_' + Item.LEVEL_CD] = Item.LEVEL_NM;
      });

    });
  }

  updateAssetLevelList();

  $scope.makePathCd = function(LevelInfoModal) {
    var P_PATH_CD = '';
    $.each($scope.AssetLevelList, function(idx, Item) {
      console.log(Item);
      if (Item.LEVEL_CD == LevelInfoModal.P_CLASS_CD && Item.LEVEL_STEP == LevelInfoModal.P_LEVEL_STEP && Item.FN_CD == LevelInfoModal.FN_CD) {
        P_PATH_CD = (Item.PATH_CD == null) ? Item.LEVEL_CD : Item.PATH_CD;
      }
    });
    LevelInfoModal.PATH_CD = '' + P_PATH_CD + ((P_PATH_CD != '') ? '_' : '') + LevelInfoModal.CLASS_CD;
  };

  $scope.insertNewLevelCode = function(item) {
    mainDataService.insertLevelCode(item).success(function(obj) {
      if (!common.isEmpty(obj.errMessage)) {
        alertify.alert('', '레벨 코드 추가 중 에러 발생 : ' + obj.errMessage);
      } else {
        alertify.alert('', '레벨 코드 정보가 추가되었습니다.');
        $scope.searchLevelCode();
      }
      $scope.closeLevelModal();
      $scope.LevelInfoModal.FN_CD = 'F';
      $scope.isFN = false;

      updateAssetLevelList();
    });
  };

  $scope.updateLevelCode = function(item) {
    console.log(item);
    mainDataService.updateLevelCode(item).success(function(obj) {
      if (!common.isEmpty(obj.errMessage)) {
        alertify.alert('', '레벨 코드 수정 중 에러 발생 : ' + obj.errMessage);
      } else {
        alertify.alert('', '레벨 코드 정보가 수정되었습니다.');
        $scope.searchLevelCode();
        // $scope.LevelInfo = {};
        $scope.closeLevelModal();
      }
      updateAssetLevelList();
    });
  };

  $scope.deleteLevelCode = function() {
    if (angular.equals({}, $scope.LevelInfo)) {
      alertify.alert('', '삭제할 레벨 코드를 선택해주세요.');
      return false;
    }

    let param = {};
    param.LEVEL_STEP = unformatLevelNum($scope.LevelInfo.LEVEL_STEP);
    param.CLASS_CD = $scope.LevelInfo.CLASS_CD;

    mainDataService.isLevelCodeUsed(param).success(function(obj) {
      if (obj > 0) {
        alertify.alert('', '사용 중인 레벨 코드는 삭제할 수 없습니다.');
        return false;
      } else {
        alertify.confirm('', '해당 레벨 코드를 삭제하시겠습니까?', function(e) {
          if (e) {
            let item = $scope.LevelInfo;
            mainDataService.deleteLevelCode(item).success(function(obj) {
              if (!common.isEmpty(obj.errMessage)) {
                alertify.alert('', '레벨 코드 삭제 중 에러 발생 : ' + obj.errMessage);
              } else {
                alertify.alert('', '레벨 코드가 삭제되었습니다.');
                $scope.searchLevelCode();
                $scope.LevelInfo = {};
              }
            });
          }
        }, function(e) {
        });
      }
    });
  };

  // 첫 페이지 로딩 시 실행
  $scope.getAssetCriteria();
  $scope.searchLevelCode();
  $scope.getAssetMaxLevelList();

  $scope.stepList = ['1', '2', '3', "4", "5", "6", "7"];
}