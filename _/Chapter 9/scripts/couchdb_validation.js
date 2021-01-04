/* CouchDB validate_doc_update function for todo lists */

function(newDoc, oldDoc, userCtx) {
  /* Must have a name which is a string */
  if (!newDoc['name']) {
    throw({forbidden: 'todo list must have a name'});
  }
  if (typeof newDoc['name'] !== 'string') {
    throw({forbidden: 'todo list name must be a string'});
  }

  /* Must have an owner field */
  if (!newDoc['owner']) {
    throw({forbidden: 'must have an owner field'}); 
  }

  /* Must set the owner field to your own ID */
  if (!oldDoc && newDoc['owner'] != userCtx.name) {
    throw({forbidden: 'must set the owner field to your own ID'});
  }

  /* Cannot change the owner field once set */
  if (oldDoc && newDoc['owner'] != oldDoc['owner']) {
    throw({forbidden: 'may not change the owner field once set'});
  }

  /* Only the owner may delete the list */
  if (newDoc['_deleted'] && newDoc['owner'] != userCtx.name) {
    throw({forbidden: 'only the owner may delete the list'});
  }

  /* The collaborators field, if present, must be an array of strings */
  if (newDoc['collaborators']) {
    if (Object.prototype.toString.call(newDoc['collaborators']) !== '[object Array]') {
      throw({forbidden: 'collaborators field must be an array'});
    }
    for (var i = 0; i < newDoc['collaborators'].length; ++i) {
      if (typeof newDoc['collaborators'][i] !== 'string') {
        throw({forbidden: 'collaborators field must be an array of strings'});
      }
    }
  }

  /* Only the owner and collaborators may view or edit */
  if (newDoc['owner'] != userCtx.name && oldDoc['collaborators'] && oldDoc['collaborators'].indexOf(userCtx.name) === -1) {
    throw({forbidden: 'only the owner and collaborators may view or edit'});
  }

  /* The items field, if present, must be an array of objects */
  if (newDoc['items']) {
    if (Object.prototype.toString.call(newDoc['items']) !== '[object Array]') {
      throw({forbidden: 'items field must be an array'});
    }

    for (var i = 0; i < newDoc['items'].length; ++i) {
      /* Each todo item must be an object */
      if (typeof newDoc['items'][i] !== 'object') {
        throw({forbidden: 'items field must be an array of objects'});
      }

      /* Each todo item must have an ID which is a string */
      if (!newDoc['items'][i]['id']) {
        throw({forbidden: 'todo item must have an id field'});
      }
      if (typeof newDoc['items'][i]['id'] !== 'string') {
        throw({forbidden: 'todo item id must be a string'});
      }

      /* Each todo item must have a description which is a string */
      if (!newDoc['items'][i]['description']) {
        throw({forbidden: 'todo item must have a description field'});
      }
      if (typeof newDoc['items'][i]['description'] !== 'string') {
        throw({forbidden: 'todo item description must be a string'});
      }

      /* Each todo item may have a media field. If present, it must be a string. */
      if (newDoc['items'][i]['media'] && typeof newDoc['items'][i]['media'] !== 'string') {
        throw({forbidden: 'todo item media field must be a string'});
      }

      /* Each todo item may have latitude and longitude fields. If one is present,
       * the other must be present, and both must be strings. */
      if (newDoc['items'][i]['latitude'] && !newDoc['items'][i]['longitude']) {
        throw({forbidden: 'todo item is missing longitude'});
      }
      if (newDoc['items'][i]['longitude'] && !newDoc['items'][i]['latitude']) {
        throw({forbidden: 'todo item is missing latitude'});
      }
      if (newDoc['items'][i]['latitude'] && typeof newDoc['items'][i]['latitude'] !== 'number') {
        throw({forbidden: 'todo item latitude must be a number'});
      }
      if (newDoc['items'][i]['longitude'] && typeof newDoc['items'][i]['longitude'] !== 'number') {
        throw({forbidden: 'todo item longitude must be a number'});
      }
    }
  }
}
