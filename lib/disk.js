
var fs = require( 'fs' )

/**
 * Disk constructor function
 * @param {String} path
 */
function Disk( path ) {
  
  if( !(this instanceof Disk) )
    return new Disk( path )
  
  this.path = path;
  
  this.MBR = new Disk.MBR( this.read() )
  
  if( !(this.MBR instanceof Error) )
    this.GPT = new Disk.GPT( this )
  
}

// Exports
module.exports = Disk

/**
 * Disk factory
 * @param  {String} path
 * @return {Disk} 
 */
Disk.load = function( path ) {
  return new Disk( path )
}

// GUID Partition Table
Disk.GPT = require( './gpt' )
// Master Boot Record
Disk.MBR = require( './mbr' )
// Volume Boot Record
Disk.VBR = require( './vbr' )
// Globally Unique Identifier
Disk.GUID = require( './guid' )

/**
 * Disk prototype
 * @type {Object}
 */
Disk.prototype = {
  
  constructor: Disk,
  
  /**
   * Reads `length` raw bytes from disk into a buffer.
   * @param  {Number} position
   * @param  {Number} length
   * @param  {Buffer} buffer
   * @param  {Number} offset
   * @return {Buffer} 
   */
  read: function( position, length, buffer, offset ) {
    
    var fd = fs.openSync( this.path, 'r' )
    
    length = length || 512
    buffer = buffer || new Buffer( length )
    offset = offset || 0
    
    fs.readSync( fd, buffer, 0, length, position )
    fs.closeSync( fd )
    
    return buffer
    
  },
  
  /**
   * Read from one to another given
   * logical block address.
   * @param  {Number} from
   * @param  {Number} to
   * @return {Buffer} 
   */
  readLBA: function( from, to ) {
    
    from = 512 * ( from || 0 )
    to   = 512 * ( to || from + 1 )
    
    return this.read( from, to )
    
  }
  
}
