

/*

	forum : includ possibilité de run JSCocoa code


*/


	JSCocoa.hazardReport

	class ApplicationController < NSObject
	{
	
		- (void)awakeFromNib
		{
			this.sourceList.delegate = this
			
			var cell = ImageAndTextCell.instance()
			this.sourceList.tableColumns[0].dataCell = cell
			
			//
			// Icons
			//
			var images = {	 'Mac' : NSImage.imageNamed('NSComputer')
							,'Console' : NSImage.imageNamed('Console')
							,'iPhoneSimulator' : NSImage.imageNamed('iPhoneSimulator') 
							,'GoogleGroups' : NSImage.imageNamed('GoogleGroups') 
							,'URL' : NSImage.imageNamed('URL') 
							}
			images['Mac'].size = new NSSize(16, 16)
			images['URL'].size = new NSSize(16, 16)
			
			//
			// Sidebar items
			//
			this.willChangeValueForKey('sidebarItems')
			this.items = [	 { name : 'SAMPLES', isGroupItem : true
							,children : [ { name : 'Mac OS', image : images['Mac'] }
										,{ name : 'iPhone Simulator', image : images['iPhoneSimulator'] }
										,{ name : 'Console', image : images['Console'] } ] }
						,{ name : 'TRADE', isGroupItem : true
							,children : [ { name : 'Download samples' }, { name : 'Upload a sample' } ] }
						,{ name : 'DISCUSS', isGroupItem : true
							,children : [ { name : 'Report Bug' }, { name : 'Request Feature' }, { name : 'Google Group', image : images['GoogleGroups'] } ] }
						,{ name : 'VISIT', isGroupItem : true
							,children : [ { name : 'Source', image : images['URL'], id : 'source' }, { name : 'Homepage', image : images['URL'], id : 'home' } ] }
					]
			this.didChangeValueForKey('sidebarItems')

			// Expand
			this.sourceList.expandItem(this.sourceList.itemAtRow(3))
			this.sourceList.expandItem(this.sourceList.itemAtRow(2))
			this.sourceList.expandItem(this.sourceList.itemAtRow(1))
			this.sourceList.expandItem(this.sourceList.itemAtRow(0))
			// Select
			this.sourceList.select({rowIndexes:NSIndexSet.indexSetWithIndex(1), byExtendingSelection:NO })
			
			
			//
			// Position window
			//
			var windowFrame = this.window.frame
			var screenFrame = NSScreen.mainScreen.visibleFrame
			this.window.setFrameOrigin(new NSPoint((screenFrame.size.width-windowFrame.size.width)/2, (screenFrame.size.height-windowFrame.size.height)*2/3))
			
			
			var view = WebView.instance({ withFrame : NSMakeRect(200, 0, 400, 400), frameName : 'blah', groupName : 'null' })
//			var view = WebView.alloc.initWithFrame(NSMakeRect(200, 0, 400, 400) )
			this.window.contentView.addSubview(view)
			view.mainFrameURL = 'http://yahoo.com'
		}
		
		- (id)sidebarItems
		{
			return	this.items
		}
		
		- (BOOL)outlineView:(NSOutlineView*)outlineView isGroupItem:(id)item
		{
			return	item.representedObject.isGroupItem
		}
		
		- (BOOL)outlineView:(NSOutlineView *)outlineView shouldSelectItem:(id)item
		{
			var canSelect =	!item.representedObject.isGroupItem
			if (canSelect)	this.switchToView(item.representedObject.id)
			return	canSelect
		}
		- (BOOL)outlineView:(NSOutlineView *)outlineView shouldCollapseItem:(id)item
		{
			return	NO
		}
		
		- (BOOL)outlineView:(NSOutlineView *)outlineView shouldEditTableColumn:(NSTableColumn *)tableColumn item:(id)item
		{
			return	NO
		}
		
		- (void)outlineView:(NSOutlineView *)olv willDisplayCell:(NSCell*)cell forTableColumn:(NSTableColumn *)tableColumn item:(id)item
		{
			cell.object = item.representedObject
		}
		
		js function switchToView(view)
		{
			log('NEW VIEW ' + view)
//			log('DEBUG CHECK ' + this.sidebarItems)
//			__jsc__.garbageCollect
		}

		IBOutlet	sourceList
		IBOutlet	window
	}
	
	
	class SourceList < NSOutlineView
	{
		- (NSRect)frameOfOutlineCellAtRow:(NSInteger)row
		{
			return	new NSRect(0, 0, 0, 0)
		}
	}

	//
	// From Apple's SourceView
	//
	class ImageAndTextCell < NSTextFieldCell
	{
		- (id)init
		{
			var r = this.Super(arguments)
			this.font = NSFont.systemFontOfSize(NSFont.smallSystemFontSize)
			return	r
		}
		- (void)drawWithFrame:(NSRect)cellFrame inView:(NSView*)controlView
		{
			var x = 0
			if (this.object.image) 
			{
				this.object.image.composite({toPoint:NSMakePoint(cellFrame.origin.x, cellFrame.origin.y+18), operation:NSCompositeSourceOver})
				x += 18
			}

			arguments[0] = new NSRect(cellFrame.origin.x+x, cellFrame.origin.y, cellFrame.size.width, cellFrame.size.height)
			this.Super(arguments)
		}
	}
	
	