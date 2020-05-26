const HexagonWidth = 160;
const HexagonHeight = 140;

const MarginBottom = 4;
const MarginLeft = -HexagonWidth / 4 + 4;

const MaxDirection = 6;
const HexagonRotation = 60;

class Hexagon {
    constructor({ row = 0, col = 0 } = {}) {

        this.row = row;
        this.col = col;

        this.inDirection = -1;
        this.outDirection = -1;

        this.currentType = null;

    }

    InitHexagonLayout() {

        this.hexagonMain = $('<div>');
        this.hexagonInside = $('<div>');
        this.hexagonNested = $('<div>');
        this.backgroundBlock = $('<img>');
        this.directionBlock = $('<div>');

        this.hexagonMain.css('width', `${HexagonWidth}px`);
        this.hexagonMain.css('height', `${HexagonHeight}px`);
        this.hexagonMain.addClass('hexagon');

        this.hexagonInside.addClass('hexagon-inside');
        this.hexagonNested.addClass('hexagon-nested');

        this.backgroundBlock.addClass('hexagon-arrow');
        this.backgroundBlock.attr('src', '/gfx/Application/arrow.png');
        this.backgroundBlock.css('display', 'none');

        this.directionBlock.addClass('hexagon-dir');

        this.hexagonNested.append(this.backgroundBlock);
        this.hexagonNested.append(this.directionBlock);
        this.hexagonInside.append(this.hexagonNested);
        this.hexagonMain.append(this.hexagonInside);
    }


    DrawHexagon({ canvas = null }) {
        if (canvas == null) return;

        this.InitHexagonLayout();

        const CurrentPosition = {
            x: this.col * (HexagonWidth + MarginLeft),
            y: this.row * (HexagonHeight + MarginBottom)
        };

        if (this.col % 2) CurrentPosition.y += HexagonHeight / 2;

        this.hexagonMain.css('left', `${CurrentPosition.x}px`);
        this.hexagonMain.css('top', `${CurrentPosition.y}px`);

        $(canvas).append(this.hexagonMain);
    }

    DrawArrowDirection() {
        this.backgroundBlock.css('display', 'block');
        this.hexagonMain.css('transform', `rotateZ(${HexagonRotation * (this.outDirection + 2)}deg)`);
        this.directionBlock.html(this.outDirection);
    }

    ChangeBackgroundByType() {
        if (this.currentType == AllTypes[0])
            this.hexagonNested.css('background-color', "#255850");

        else if (this.currentType == AllTypes[1])
            this.hexagonNested.css('background-color', "#91aff6");

        else if (this.currentType == AllTypes[2])
            this.hexagonNested.css('background-color', "#c27f15");

        else if (this.currentType == AllTypes[3])
            this.hexagonNested.css('background-color', "#90457a");
    }

    InitClickEvent() {

        this.hexagonMain.on('click', (ev) => {

            if (!CheckValidation({ element: this })) return;

            this.currentType = ActualType;

            if (++this.outDirection >= MaxDirection)
                this.outDirection = 0;

            ChangeInDirection({ element: this });

            this.DrawArrowDirection();
            this.ChangeBackgroundByType();

            SetLevelInfo({ element: this });
        })
    }

    Edit({ currentType = "", inDirection = -1, outDirection = -1 } = {}) {

        this.currentType = currentType;
        this.inDirection = inDirection;
        this.outDirection = outDirection;

        this.ChangeBackgroundByType();
        this.DrawArrowDirection();
    }
}