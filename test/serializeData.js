QUnit.module( 'serializeData', function () {

  QUnit.test( 'basic', function ( assert ) {

    var $form = $(
      '<form>' +
        '<input type="text" name="text" value="1">' +
        '<input type="text" name="nested[text]" value="1">' +
        '<input type="text" name="nested[object][text]" value="1">' +
        '<input type="text" name="indexed[0]" value="2">' +
        '<input type="text" name="indexed[1]" value="3">' +
        '<input type="checkbox" name="check" value="4" checked>' +
        '<input type="checkbox" name="check2" value="42">' +
        '<input type="checkbox" name="checkOn" checked>' +
        '<input type="checkbox" name="checkOn2">' +
        '<input type="checkbox" name="checkArray[]" value="5" checked>' +
        '<input type="checkbox" name="checkArray[]" value="6" checked>' +
        '<input type="checkbox" name="checkArray[]" value="7">' +
        '<input type="checkbox" name="checkOnArray[]" checked>' +
        '<input type="checkbox" name="checkOnArray[]" checked>' +
        '<input type="checkbox" name="checkOnArray[]">' +
        '<select name="select[]" multiple><option value="a" selected></option><option value="b" selected></option></select>' +
        '<input type="radio" name="radio" value="5">' +
        '<input type="radio" name="radio" value="6" checked>' +
        '<input type="radio" name="radio" value="7">' +
      '</form>'
    );

    assert.deepEqual( $form.serializeData(), {
      text: '1',
      nested: {
        text: '1',
        object: {
          text: '1'
        }
      },
      indexed: [ '2', '3' ],
      check: '4',
      checkOn: 'on',
      checkArray: [ '5', '6' ],
      checkOnArray: [ 'on', 'on' ],
      select: [ 'a', 'b' ],
      radio: '6'
    } );

  } );

} );
