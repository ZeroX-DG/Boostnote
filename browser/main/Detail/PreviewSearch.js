import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './PreviewSearch.styl'
import ee from 'browser/main/lib/eventEmitter'

class PreviewSearch extends React.Component {
  handleKeyDown(e) {
    if (e.keyCode == 13) {
      ee.emit('preview:search', e.target.value)
    }
  }

  render() {
    return (
      <div styleName='preview-search'>
        <div styleName='search-icon'>
          <i className='fa fa-search' />
        </div>
        <input
          styleName='search-box'
          onKeyDown={this.handleKeyDown}
          placeholder='search...'
        />
      </div>
    )
  }
}

export default CSSModules(PreviewSearch, styles)
