// Copyright 2018 NTT Group

// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

const TrackConfigurationLoader = require('./track-configuration-loader');
const Tile = require('./tile');

class TilePositionCalculator {

    constructor() {
        new TrackConfigurationLoader().getTrackConfig(this.setTrackConfiguration.bind(this));
    }

    setTrackConfiguration(trackConfiguration) {
        this.trackConfiguration = trackConfiguration;
    }

    getCarPosition(ankiTileId, previousTileIds) {

        //TODO: Somehow its hanging here
        if(!this.trackConfiguration)
            return -1;

        //find all possible tiles (anki tiles have no unique id)
        var possibleTiles = [];

        //we know where the car was previously,
        //we search the next tile with the right anki tile id
        if(previousTileIds !== undefined && previousTileIds.length === 1) {
            var previousTileId = previousTileIds[0];
            var previousTileFound = false;
            var index = 0;
            var loopsCompleted = 0;

            while(true) {
                var normalizedIndex = index % this.trackConfiguration.length;

                //Safety first, should anyway not happen
                if(loopsCompleted >= 2) {
                    return [];
                }

                //We found the tile
                if(this.trackConfiguration[normalizedIndex].id === previousTileId) {
                    previousTileFound = true;
                } else {
                    if (previousTileFound && this.trackConfiguration[normalizedIndex].realId == ankiTileId)
                        return [this.trackConfiguration[normalizedIndex].id];
                }
                index++;
                if(index % this.trackConfiguration === 0)
                    loopsCompleted++;
            }
        }
        //We have no info about our last position, get all possibilities
        else {
            for (var index in this.trackConfiguration) {
                var tile = this.trackConfiguration[index];

                if (tile.realId === ankiTileId)
                    possibleTiles.push(tile.id);
            }
            return possibleTiles;
        }
    }
}

module.exports = TilePositionCalculator;
