import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Academy from '@/models/Academy';

// GET /api/academy - Get all academy submissions
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const author = searchParams.get('author');
    const type = searchParams.get('type');
    const tags = searchParams.get('tags');

    const skip = (page - 1) * limit;

    // Build query
    let query: any = {
      status: 'approved' // Only show approved submissions to users
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { deskripsi: { $regex: search, $options: 'i' } }
      ];
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (tags) {
      query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
    }

    // Get total count
    const total = await Academy.countDocuments(query);

    // Get academy submissions
    const academy = await Academy.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: academy,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching academy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch academy submissions' },
      { status: 500 }
    );
  }
}

// POST /api/academy - Create a new academy submission
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const { title, deskripsi, author, link } = body;
    if (!title || !deskripsi || !author || !link) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, deskripsi, author, link' },
        { status: 400 }
      );
    }

    // Create new academy submission
    const academy = new Academy({
      title,
      deskripsi,
      author,
      link,
      pdfUrl: body.pdfUrl || '',
      imageUrl: body.imageUrl || '',
      type: body.type || 'course',
      tags: body.tags || [],
      messageId: body.messageId || '',
      status: 'pending' // All new submissions start as pending
    });

    await academy.save();

    return NextResponse.json({
      success: true,
      data: academy,
      message: 'Academy submission created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating academy:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create academy submission' },
      { status: 500 }
    );
  }
}

// DELETE /api/academy - Delete an academy submission by ID
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Academy ID is required' },
        { status: 400 }
      );
    }

    const academy = await Academy.findByIdAndDelete(id);

    if (!academy) {
      return NextResponse.json(
        { success: false, error: 'Academy submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: academy,
      message: 'Academy submission deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting academy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete academy submission' },
      { status: 500 }
    );
  }
}
