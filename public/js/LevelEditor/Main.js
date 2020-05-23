let ActualLevel = [];
const LevelInfo = {};
const Geometries = [];
const AllTypes = [];

let ActualQuantity = 0;
let ActualType = null;

const _Connection = new Connection({ connectionName: "ConnectionToServer" });

$(document).ready(() => {

    GenerateQuantity({ min: 2, max: 5 });
    SetChangeValueEvent();
    DrawLevelByQuantity({ quantity: 2 });
    SetChangeTypeEvent($("#WallType"), $("#EnemyType"), $("#TreasureType"), $("#LightType"));
    SetSaveButtonEvent();
    SetLoadLevelsButtonEvent();
    SetPlayGameButtonEvent();

})


const GenerateQuantity = ({ min = 0, max = 8 } = {}) => {
    for (let it = min; it <= max; it++) {

        const optionControl = $("<option>");
        optionControl.html(`Quan : ${it}`);
        optionControl.attr('value', it);

        $("#QuantitySelect").append(optionControl);
    }
}

const SetChangeValueEvent = () => {
    $('#QuantitySelect').on('change', (ev) => {
        ActualLevel.splice(0, ActualLevel.length);
        DrawLevelByQuantity({ quantity: $('#QuantitySelect').val() });
    })
}

const DrawLevelByQuantity = ({ quantity = 0 } = {}) => {
    ActualQuantity = quantity;

    $('#LevelCanvas').html("");

    for (let currentRow = 0; currentRow < quantity; currentRow++) {
        for (let currentCol = 0; currentCol < quantity; currentCol++) {
            const _Hexagon = new Hexagon({ row: currentRow, col: currentCol });
            _Hexagon.DrawHexagon({ canvas: $('#LevelCanvas') });
            _Hexagon.InitClickEvent();
            Geometries.push(_Hexagon);
        }
    }

    LevelInfo.Size = ActualQuantity;
}

const SetChangeTypeEvent = (...buttonTypes) => {
    if (!buttonTypes instanceof Array) return;

    buttonTypes.forEach((button) => {
        AllTypes.push(button.attr('type'));

        button.on('click', (ev) => {
            ActualType = button.attr('type');

            buttonTypes.forEach((button) => {
                button.removeClass('btn-primary');
                button.addClass('btn-secondary');
            });

            button.addClass('btn-primary');
            button.removeClass('btn-secondary');
        })
    })
    ActualType = AllTypes[0];
}

const ChangeInDirection = ({ element = null } = {}) => {
    if (!element instanceof Hexagon) return;

    // for (let currentObject = 0; currentObject < ActualLevel.length; currentObject++) {
    //     if (ActualLevel[currentObject].row == element.row &&
    //         ActualLevel[currentObject].col == element.col && currentObject > 0) {

    //         const LastItemOutDirection = ActualLevel[currentObject - 1].outDirection;
    //         element.inDirection = LastItemOutDirection < 3 ?
    //             LastItemOutDirection + 3 : LastItemOutDirection - 3;

    //         if (currentObject < ActualLevel.length - 1) {
    //             const ActualOutDirection = ActualLevel[currentObject].outDirection;

    //             ActualLevel[currentObject + 1].inDirection = ActualOutDirection < 3 ?
    //                 ActualOutDirection + 3 : ActualOutDirection - 3;
    //         }
    //     }
    // }
}

const SetLevelInfo = ({ element = null } = {}) => {
    if (!element instanceof Hexagon) return;

    let IsInArray = false;

    const ElementData = {
        row: element.row,
        col: element.col,
        currentType: element.currentType,
        inDirection: element.inDirection,
        outDirection: element.outDirection
    }

    if (ActualLevel.length > 0) {

        ActualLevel.forEach((object) => {

            if (object.row == ElementData.row &&
                object.col == ElementData.col) {
                IsInArray = true;

                object.currentType = ElementData.currentType;
                object.inDirection = ElementData.inDirection;
                object.outDirection = ElementData.outDirection;
            }
        });

        if (!IsInArray) ActualLevel.push(ElementData);
    }

    else if (ActualLevel.length == 0) ActualLevel.push(ElementData);

    LevelInfo.Level = ActualLevel;
    DisplayJSONInfo();
}

const DisplayJSONInfo = () => {
    $('#LevelDataInfo').html("");
    $('#LevelDataInfo').append(JSON.stringify(LevelInfo, null, 3));
}

const SetSaveButtonEvent = () => {
    $('#SaveButton').on('click', (ev) => {

        const LevelData = {
            level: LevelInfo,
            name: $('#LevelName').val(),
            author: $('#LevelAuthor').val()
        }

        _Connection.Save({ data: LevelData });
    })
}

const SetLoadLevelsButtonEvent = () => {
    $('#LoadButtonModal').on('click', (ev) => {
        _Connection.LoadLevels();
    })
}

const SetLevelsLayout = ({ data = [] } = {}) => {
    if (!data instanceof Array) return;

    if (data.length == 0) {
        $(".LevelsTable").css('display', 'none');
        return;
    }

    $("#LevelsInfo").html("");

    const Columns = 4;

    for (let levelRow = 0; levelRow < data.length; levelRow++) {
        const LevelRow = $('<tr>');

        for (let levelCol = 0; levelCol < Columns; levelCol++) {
            const LevelCol = $('<td>');

            switch (levelCol) {
                case 0:
                    LevelCol.html(levelRow + 1);
                    LevelCol.css('width', '20%');
                    break;

                case 1:
                    LevelCol.html(data[levelRow].name);
                    LevelCol.css('width', '30%');
                    break;

                case 2:
                    LevelCol.html(data[levelRow].author);
                    LevelCol.css('width', '30%');
                    break;

                case 3:
                    const LoadButton = $('<button>');
                    LoadButton.addClass('btn btn-success button-small');
                    LoadButton.attr('data-dismiss', 'modal');
                    LoadButton.html("Load This Level");

                    LoadButton.attr('id', `Level_${data[levelRow].name}_${data[levelRow].author}^`);
                    LoadButton.on('click', (ev) => LoadLevel({ data: data[levelRow].levelInfo }));

                    LevelCol.append(LoadButton);
                    LevelCol.css('width', '20%');
                    break;
            }
            LevelRow.append(LevelCol);
        }
        $('#LevelsInfo').append(LevelRow);
    }
}

const LoadLevel = ({ data = null }) => {
    if (!data instanceof Array) return;

    ActualQuantity = data.Size;
    ActualLevel = data.Level;

    DrawLevelByQuantity({ quantity: ActualQuantity });

    Geometries.forEach((geometry) => {
        ActualLevel.forEach((item) => {
            if (item.row == geometry.row && item.col == geometry.col) {
                geometry.Edit({
                    currentType: item.currentType,
                    inDirection: parseInt(item.inDirection),
                    outDirection: parseInt(item.outDirection)
                })
            }
        })
    })

    LevelInfo.Level = [...ActualLevel];
    DisplayJSONInfo();
}

const SetPlayGameButtonEvent = () => {
    $('#GameButton').on('click', (ev) => {
        _Connection.SetCurrentLevel({ data: LevelInfo });
    })
}
